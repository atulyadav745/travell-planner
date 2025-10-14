import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const cities = await prisma.activity.findMany({
      select: {
        city: true,
      },
      distinct: ['city'],
      orderBy: {
        city: 'asc',
      },
    });

    return NextResponse.json(cities.map(c => c.city));
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching cities' }, { status: 500 });
  }
}