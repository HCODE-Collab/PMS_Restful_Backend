
import { Request, Response } from 'express';
import prisma from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';
import { VehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';
import { logAction } from '../prisma/prisma-client';
import { Prisma } from '@prisma/client';

// Define VehicleType enum locally if not exported by Prisma
export enum VehicleType {
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  // Add other vehicle types as needed
}

export class VehicleController {
  static async createVehicle(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { plateNumber, vehicleType, size, attributes } = req.body as VehicleDto;
    console.log(plateNumber);
    
    try {
      const { v4: uuidv4 } = require('uuid');
      const vehicle = await prisma.vehicle.create({
        data: { id: uuidv4(), userId, plateNumber, vehicleType, size, attributes },
      });
      await logAction(userId, 'Vehicle created');
      return ServerResponse.created(res, vehicle);
    } catch (error) {
      return ServerResponse.badRequest(res, 'Plate number already exists');
    }
  }

  static async updateVehicle(req: Request, res: Response) {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { plateNumber, vehicleType, size, attributes } = req.body as UpdateVehicleDto;
    const vehicle = await prisma.vehicle.findFirst({ where: { id, userId } });
    if (!vehicle) {
      return ServerResponse.notFound(res, 'Vehicle not found');
    }
    try {
      const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: { plateNumber, vehicleType, size, attributes },
      });
      await logAction(userId, 'Vehicle updated');
      return ServerResponse.success(res, updatedVehicle);
    } catch (error) {
      return ServerResponse.badRequest(res, 'Plate number already exists');
    }
  }

  static async deleteVehicle(req: Request, res: Response) {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const vehicle = await prisma.vehicle.findFirst({ where: { id, userId } });
    if (!vehicle) {
      return ServerResponse.notFound(res, 'Vehicle not found');
    }
    await prisma.vehicle.delete({ where: { id } });
    await logAction(userId, 'Vehicle deleted');
    return ServerResponse.success(res, null, 'Vehicle deleted');
  }

  static async getVehicles(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { page = '1', limit = '10', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: Prisma.vehicleWhereInput = { userId };
    if (search) {
      const searchStr = search as string;
      const isVehicleType = Object.values(VehicleType).includes(searchStr.toUpperCase() as VehicleType);
      where.OR = [
        { plateNumber: { contains: searchStr } },
        ...(isVehicleType ? [{ vehicleType: searchStr.toUpperCase() as VehicleType }] : []),
      ];
    }

    try {
      const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
          where,
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
        }),
        prisma.vehicle.count({ where }),
      ]);
      await logAction(userId, 'Vehicles listed');
      return ServerResponse.success(res, {
        items: vehicles,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      return ServerResponse.error(res, 'Failed to fetch vehicles');
    }
  }

  static async getVehicleById(req: Request, res: Response) {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const vehicle = await prisma.vehicle.findFirst({ where: { id, userId } });
    if (!vehicle) {
      return ServerResponse.notFound(res, 'Vehicle not found');
    }
    await logAction(userId, 'Vehicle viewed');
    return ServerResponse.success(res, vehicle);
  }
}