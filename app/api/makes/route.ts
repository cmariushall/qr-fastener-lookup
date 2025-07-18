import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get('year');
  if (!year) return NextResponse.json([]);

  const makes = await prisma.vehicle.findMany({
    where: { year: parseInt(year, 10) },
    distinct: ['make'],
    orderBy: { make: 'asc' },
    select: { make: true },
  });

  return NextResponse.json(makes.map(m => m.make));
}
