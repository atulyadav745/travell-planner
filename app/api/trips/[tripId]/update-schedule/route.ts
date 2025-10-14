import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This expects an array of all scheduled activities for a trip
// with their potentially new day and order.
export async function PUT(
  request: Request,
  context: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await context.params;
    const body: { id: string; day: number; order: number }[] = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Request body must be an array' }, { status: 400 });
    }

    // Use a transaction to update all items at once.
    // This ensures data integrity. If one update fails, they all fail.
    const updateTransactions = body.map(item =>
      prisma.scheduledActivity.update({
        where: { id: item.id, tripId: tripId }, // Ensure we only update items for this trip
        data: {
          day: item.day,
          order: item.order,
        },
      })
    );

    await prisma.$transaction(updateTransactions);

    return NextResponse.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error updating schedule' }, { status: 500 });
  }
}