import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('[API /years] start');
    const years = await prisma.vehicle.findMany({
      distinct: ['year'],
      orderBy: { year: 'desc' },
      select: { year: true },
    });
    console.log('[API /years] rows:', years.length);
    return NextResponse.json(years.map(y => y.year));
  } catch (err: unknown) {
    console.error('[API /years] ERROR', err);
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
