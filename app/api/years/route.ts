import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const years = await prisma.vehicle.findMany({
    distinct: ['year'],
    orderBy: { year: 'desc' },
    select: { year: true },
  });
  return NextResponse.json(years.map(y => y.year));
}
