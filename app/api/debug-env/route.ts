import { NextResponse } from 'next/server';

export async function GET() {
  const raw = process.env.DATABASE_URL || '';
  // Mask password
  // touch
  const masked = raw.replace(/:[^:@]+@/, '://****@');
  return NextResponse.json({
    hasVar: !!raw,
    sampleStart: masked.slice(0, 70),
  });
}
    