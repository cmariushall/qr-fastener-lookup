import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get('year');
  const make = req.nextUrl.searchParams.get('make');

  if (!year || !make) return NextResponse.json([]);

  const models = await prisma.vehicle.findMany({
    where: {
      year: parseInt(year),
      make: make,
    },
    distinct: ['model'],
    orderBy: { model: 'asc' },
    select: { model: true },
  });

  return NextResponse.json(models.map(v => v.model));
}
