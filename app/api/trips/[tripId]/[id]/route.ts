import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request
): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    const trip = await prisma.trip.findUnique({
      where: { id: id },
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
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Error fetching trip' },
      { status: 500 }
    );
  }
}