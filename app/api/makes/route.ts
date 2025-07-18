import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get('year');

  if (!year) return NextResponse.json([]);

  const makes = await prisma.vehicle.findMany({
    where: { year: parseInt(year) },
    distinct: ['make'],
    orderBy: { make: 'asc' },
    select: { make: true },
  });

  return NextResponse.json(makes.map(v => v.make));
}
