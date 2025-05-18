import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
// TODO : downgraded @types/node to 15.14.1 to avoid error on NodeJS.Global
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}



export const logAction = async (userId: string | null, action: string) => {
  try {
    await prisma.log.create({
      data: {
        userId,
        action,
      },
    });
  } catch (err) {
    console.error('Log error:', err);
  }
};

export default prisma;

function uuid(): any {
  throw new Error('Function not implemented.');
}
