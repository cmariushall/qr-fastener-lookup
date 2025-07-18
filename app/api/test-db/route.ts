import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Minimal connectivity + basic counts
    const ping = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 as ok`;
    const vehicleCount = await prisma.vehicle.count();
    const oneVehicle = await prisma.vehicle.findFirst({
      select: { year: true, make: true, model: true }
    });
    return NextResponse.json({
      ok: true,
      ping,
      vehicleCount,
      sample: oneVehicle
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        message: msg,
        // crude stack trim
        stack: err instanceof Error ? err.stack?.split('\n').slice(0,4) : []
      },
      { status: 500 }
    );
  }
}
