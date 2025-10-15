import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { differenceInDays } from 'date-fns';
import { distributeActivities } from '@/lib/scheduling';

export async function POST(
  request: Request,
  context: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await context.params;

    // Get the trip and its selected activities
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        startDate: true,
        endDate: true,
        selectedActivityIds: true,
      },
    });

    if (!trip || trip.selectedActivityIds.length === 0) {
      return NextResponse.json({ error: 'No activities selected for this trip' }, { status: 400 });
    }

    // Get all selected activities
    const activities = await prisma.activity.findMany({
      where: { id: { in: trip.selectedActivityIds } },
    });

    if (activities.length === 0) {
      return NextResponse.json({ error: 'No valid activities found for this trip' }, { status: 400 });
    }

    // Calculate number of days for the trip
    const numberOfDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

    // Use our scheduling algorithm to distribute activities
    const scheduledActivities = distributeActivities(activities, numberOfDays);

    await prisma.$transaction(async (tx) => {
      // Clear the old schedule
      await tx.scheduledActivity.deleteMany({
        where: { tripId: tripId },
      });

      // Create the new scheduled activities one by one to let Prisma handle ID generation
      for (const sa of scheduledActivities) {
        await tx.scheduledActivity.create({
          data: {
            activityId: sa.activityId,
            day: sa.day,
            order: sa.order,
            tripId: tripId,
          },
        });
      }
    });

    // Fetch and return the updated trip with the new schedule
    const updatedTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        scheduledActivities: {
          include: {
            activity: true
          },
          orderBy: [
            { day: 'asc' },
            { order: 'asc' },
          ],
        },
      },
    });

    return NextResponse.json(updatedTrip);

  } catch (error) {
    console.error('Error scheduling activities:', error);
    return NextResponse.json({ error: 'Error scheduling activities' }, { status: 500 });
  }
}