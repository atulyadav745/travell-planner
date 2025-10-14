import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate } = body;

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTrip = await prisma.trip.create({
      data: {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        selectedActivityIds: [], // Start with an empty list
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error creating trip' }, { status: 500 });
  }
}
