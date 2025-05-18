

import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VehicleType } from './vehicle.dto';
// import enums from @prisma/client, adjust names as per your schema
// import { Size, Location } from '@prisma/client';
// Define Location enum here if not available from @prisma/client
export enum Location {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}
// Define Size enum here if not available from @prisma/client
export enum Size {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}
// import VehicleType from its correct location or define it if missing
// Example: import { VehicleType } from '../enums/vehicle-type.enum';

export class BulkSlotDto {
  @IsInt()
  @IsNotEmpty()
  count!: number;

  @IsString()
  @IsNotEmpty()
  prefix!: string;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @IsEnum(Size)
  size!: Size;

  @IsEnum(Location)
  location!: Location;
}

export class SlotDto {
  @IsString()
  @IsNotEmpty()
  slotNumber!: string;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @IsEnum(Size)
  size!: Size;

  @IsEnum(Location)
  location!: Location;
}

export class UpdateSlotDto {
  @IsString()
  @IsOptional()
  slotNumber?: string;

  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;

  @IsEnum(Size)
  @IsOptional()
  size?: Size;

  @IsEnum(Location)
  @IsOptional()
  location?: Location;
}

export class SlotRequestDto {
  @IsString()
  @IsNotEmpty()
  vehicleId!: string;
}

export class UpdateSlotRequestDto {
  @IsString()
  @IsOptional()
  vehicleId?: string;
}

export class ApproveSlotRequestDto {
  @IsString()
  @IsOptional()
  slotId?: string;
}

export class RejectSlotRequestDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
