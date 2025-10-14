import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    // Return error if no city is specified
    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const activities = await prisma.activity.findMany({
      where: { city },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching activities' }, { status: 500 });
  }
}
