import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// The key change is in the function's second argument signature
export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    // Await params before using its properties (Next.js dynamic API requirement)
    const awaitedParams = await params;
    const { tripId } = awaitedParams;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        scheduledActivities: {
          include: {
            activity: true,
          },
          orderBy: [
            { day: 'asc' },
            { order: 'asc' },
          ],
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

