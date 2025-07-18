import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ping = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 as ok`;
    const vehicleCount = await prisma.vehicle.count();
    return NextResponse.json({
      ok: true,
      ping,
      vehicleCount
    });
  } catch (err: unknown) {
    let message = 'Unknown error';
    let code: string | undefined;
    if (err instanceof Error) {
      message = err.message;
      // @ts-ignore (Prisma errors sometimes have code)
      code = (err as any).code;
    }
    return NextResponse.json(
      {
        ok: false,
        message,
        code
      },
      { status: 500 }
    );
  }
}
