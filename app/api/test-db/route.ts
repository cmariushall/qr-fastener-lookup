import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const ping = await prisma.$queryRaw`SELECT 1 as ok`;
    const vehicleCount = await prisma.vehicle.count();
    return NextResponse.json({
      ok: true,
      ping,
      vehicleCount
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        message: e.message,
        code: e.code,
        stack: e.stack?.split('\n').slice(0,4)
      },
      { status: 500 }
    );
  }
}
