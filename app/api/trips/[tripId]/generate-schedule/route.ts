import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Client } from '@googlemaps/google-maps-services-js';

const googleMapsClient = new Client({});

export async function POST(
  request: Request,
  context: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await context.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { selectedActivityIds: true },
    });

    if (!trip || trip.selectedActivityIds.length === 0) {
      return NextResponse.json({ error: 'No activities selected for this trip' }, { status: 400 });
    }

    const activities = await prisma.activity.findMany({
      where: { id: { in: trip.selectedActivityIds } },
    });

    if (activities.length === 0) {
        return NextResponse.json({ error: 'No valid activities found for this trip' }, { status: 400 });
    }
    
    // If only one activity, no need to optimize. Just create it.
    if (activities.length === 1) {
         await prisma.$transaction(async (tx) => {
            await tx.scheduledActivity.deleteMany({ where: { tripId } });
            await tx.scheduledActivity.create({
                 data: {
                     tripId: tripId,
                     activityId: activities[0].id,
                     day: 1,
                     order: 0,
                 }
             });
         });
         return NextResponse.json({ message: 'Schedule created for single activity' });
    }

    const locations = activities.map(a => ({
      lat: a.latitude,
      lng: a.longitude,
    }));

    const origin = locations.shift()!; // Use first activity as start
    const destination = origin; // And also as end for a loop, creating a round trip
    const waypoints = locations; // The rest are waypoints

    const directionsResponse = await googleMapsClient.directions({
      params: {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimize: true, // The key optimization parameter
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const optimizedOrder = directionsResponse.data.routes[0].waypoint_order;
    
    const originalWaypoints = activities.slice(1);
    const finalOrderedActivities = [
        activities[0], 
        ...optimizedOrder.map(index => originalWaypoints[index])
    ];
    
    await prisma.$transaction(async (tx) => {
      // Clear the old schedule
      await tx.scheduledActivity.deleteMany({
        where: { tripId: tripId },
      });

      // Create the new, optimized schedule
      const createPromises = finalOrderedActivities.map((activity, index) => {
        return tx.scheduledActivity.create({
          data: {
            tripId: tripId,
            activityId: activity.id,
            day: 1, // Simplified to a single day
            order: index,
          },
        });
      });
      await Promise.all(createPromises);
    });

    return NextResponse.json({ message: 'Schedule generated successfully' });

  } catch (error) {
    console.error('Request error', error);

    // --- THIS IS THE CORRECTED PART ---
    // Safely check if the error is an object with the expected properties
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as any).response;
      if (response?.data?.error_message) {
        const gmapsError = response.data.error_message;
        console.error('Google Maps API Error:', gmapsError);
        return NextResponse.json({ error: `Google Maps API Error: ${gmapsError}` }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Error generating schedule' }, { status: 500 });
  }
}
