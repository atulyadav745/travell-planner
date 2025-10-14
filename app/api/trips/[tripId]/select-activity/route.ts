import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const selectActivitySchema = z.object({
  activityId: z.string().min(1, 'Activity ID is required'),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await context.params;
  if (!tripId) {
    return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
  }

  const result = selectActivitySchema.safeParse(await request.json());
  if (!result.success) {
    // Use Zod's flattenError to get formErrors and fieldErrors
    // @ts-ignore
    const flat = (typeof result.error.flatten === 'function') ? result.error.flatten() : { formErrors: [result.error.message], fieldErrors: {} };
    return NextResponse.json({ error: flat.formErrors, fieldErrors: flat.fieldErrors }, { status: 400 });
  }
  const { activityId } = result.data;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const updatedSelectedIds = [...trip.selectedActivityIds, activityId];

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        selectedActivityIds: updatedSelectedIds,
      },
      // --- THIS IS THE FIX ---
      // We are now including the full itinerary data in the response,
      // ensuring the frontend always gets a consistent Trip object.
      include: {
        scheduledActivities: {
          include: {
            activity: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      // ----------------------
    });

    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error) {
    console.error('Error selecting activity:', error);
    return NextResponse.json({ error: 'Failed to select activity' }, { status: 500 });
  }
}
