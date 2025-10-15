import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: {
    activityId: string;
  };
}

export async function DELETE(
  request: Request
): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const activityId = pathParts[pathParts.length - 1];

    // Get the scheduled activity to find its tripId and activityId
    const scheduledActivity = await prisma.scheduledActivity.findUnique({
      where: { 
        id: activityId 
      },
      include: {
        trip: true,
      },
    });

    if (!scheduledActivity) {
      return NextResponse.json(
        { error: 'Scheduled activity not found' },
        { status: 404 }
      );
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete the scheduled activity
      await tx.scheduledActivity.delete({
        where: { id: activityId },
      });

      // Remove the activity ID from the trip's selectedActivityIds
      // Only if this was the last scheduled instance of this activity
      const remainingScheduled = await tx.scheduledActivity.count({
        where: {
          tripId: scheduledActivity.tripId,
          activityId: scheduledActivity.activityId,
        },
      });

      if (remainingScheduled === 0) {
        await tx.trip.update({
          where: { id: scheduledActivity.tripId },
          data: {
            selectedActivityIds: {
              set: scheduledActivity.trip.selectedActivityIds.filter(
                (id) => id !== scheduledActivity.activityId
              ),
            },
          },
        });
      }

      // Return the updated trip with all scheduled activities
      return await tx.trip.findUnique({
        where: { id: scheduledActivity.tripId },
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
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting scheduled activity:', error);
    return NextResponse.json(
      { error: 'Error deleting scheduled activity' },
      { status: 500 }
    );
  }
}