import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const years = await prisma.vehicle.findMany({
    distinct: ['year'],
    orderBy: { year: 'desc' },
    select: { year: true },
  });

  return NextResponse.json(years.map(v => v.year));
}
