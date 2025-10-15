import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { differenceInDays } from 'date-fns';
import { distributeActivities } from '@/lib/scheduling';

export async function POST(request: Request) {
  try {
    const { destination, startDate, endDate } = await request.json();

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Validate dates
    if (endDateTime < startDateTime) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    // Calculate number of days for the trip
    const numberOfDays = differenceInDays(endDateTime, startDateTime) + 1;

    // Create trip
    const trip = await prisma.trip.create({
      data: {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        selectedActivityIds: [],
      },
      include: {
        scheduledActivities: {
          include: {
            activity: true,
          },
        },
      },
    });

    // Get activities for the destination
    const activities = await prisma.activity.findMany({
      where: {
        city: destination,
      },
      orderBy: {
        priority: 'desc',
      },
    });

    if (activities.length === 0) {
      return NextResponse.json(trip, { status: 201 });
    }

    // Auto-schedule activities
    const activitiesWithNullHandling = activities.map(activity => ({
      ...activity,
      bestTimeOfDay: activity.bestTimeOfDay || null
    }));
    const scheduledActivities = distributeActivities(activitiesWithNullHandling, numberOfDays);

    // First, update the selected activity IDs
    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        selectedActivityIds: activities.map(a => a.id),
      },
    });

    // Then create the scheduled activities
    await prisma.scheduledActivity.createMany({
      data: scheduledActivities.map(sa => ({
        activityId: sa.activityId,
        day: sa.day,
        order: sa.order,
        tripId: trip.id,
      })),
    });

    // Finally, fetch the updated trip with all relations
    const updatedTrip = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: {
        scheduledActivities: {
          include: {
            activity: true,
          },
          orderBy: {
            day: 'asc',
          },
        },
      },
    });

    if (!updatedTrip) {
      return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
    }

    return NextResponse.json(updatedTrip, { status: 201 });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error creating trip' }, { status: 500 });
  }
}
