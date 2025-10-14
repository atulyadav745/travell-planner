import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ActivityType } from "@prisma/client";

const MAX_DAILY_DURATION = 480; // 8 hours in minutes

interface DayPlan {
  day: number;
  activities: {
    activityId: string;
    order: number;
    startTime?: string;
  }[];
  totalDuration: number;
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to get preferred time slot for an activity
function getPreferredTimeSlot(activityType: ActivityType): 'morning' | 'afternoon' | 'evening' {
  switch (activityType) {
    case ActivityType.PARK:
    case ActivityType.LANDMARK:
      return 'morning';
    case ActivityType.MUSEUM:
    case ActivityType.SHOPPING:
      return 'afternoon';
    case ActivityType.RESTAURANT:
    case ActivityType.ENTERTAINMENT:
      return 'evening';
    default:
      return 'afternoon';
  }
}

async function generateSuggestedItinerary(
  destination: string,
  startDate: Date,
  endDate: Date
): Promise<DayPlan[]> {
  // Get all activities for the destination with full details
  const activities = await prisma.activity.findMany({
    where: {
      city: destination,
    },
    orderBy: [
      { priority: 'desc' },
      { typicalDuration: 'asc' }
    ],
  });

  // Calculate number of days
  const tripDuration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  // Initialize day plans
  const dayPlans: DayPlan[] = Array.from({ length: tripDuration }, (_, i) => ({
    day: i + 1,
    activities: [],
    totalDuration: 0,
  }));

  // Group activities by type and time preference
  const activitiesByType = activities.reduce((acc, activity) => {
    acc[activity.activityType] = acc[activity.activityType] || [];
    acc[activity.activityType].push(activity);
    return acc;
  }, {} as Record<ActivityType, typeof activities>);

  // Define ideal activity mix per day with time slots
  const dailyMix = [
    { type: ActivityType.PARK, slot: 'morning' },
    { type: ActivityType.LANDMARK, slot: 'morning' },
    { type: ActivityType.MUSEUM, slot: 'afternoon' },
    { type: ActivityType.SHOPPING, slot: 'afternoon' },
    { type: ActivityType.RESTAURANT, slot: 'evening' },
    { type: ActivityType.ENTERTAINMENT, slot: 'evening' },
  ];

  // Fill each day with a balanced mix of activities
  for (const dayPlan of dayPlans) {
    const usedActivities = new Set<string>();
    let lastLocation: { lat: number; lon: number } | null = null;

    // Process each time slot
    for (const { type, slot } of dailyMix) {
      const availableActivities = (activitiesByType[type] || [])
        .filter(a => !usedActivities.has(a.id))
        .sort((a, b) => {
          // If we have a last location, prioritize closer activities
          if (lastLocation) {
            const distA = calculateDistance(lastLocation.lat, lastLocation.lon, a.latitude, a.longitude);
            const distB = calculateDistance(lastLocation.lat, lastLocation.lon, b.latitude, b.longitude);
            if (Math.abs(distA - distB) > 1) { // Only consider distance if difference is significant
              return distA - distB;
            }
          }
          // Otherwise sort by priority
          return b.priority - a.priority;
        });

      for (const activity of availableActivities) {
        if (dayPlan.totalDuration + activity.typicalDuration <= MAX_DAILY_DURATION) {
          // Determine start time based on slot
          let startTime;
          switch (slot) {
            case 'morning':
              startTime = '09:00';
              break;
            case 'afternoon':
              startTime = '13:00';
              break;
            case 'evening':
              startTime = '17:00';
              break;
          }

          dayPlan.activities.push({
            activityId: activity.id,
            order: dayPlan.activities.length,
            startTime,
          });
          dayPlan.totalDuration += activity.typicalDuration;
          usedActivities.add(activity.id);
          lastLocation = { lat: activity.latitude, lon: activity.longitude };
          break;
        }
      }
    }

    // Sort activities by start time and optimize route within each time slot
    dayPlan.activities.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return a.order - b.order;
    });
  }

  return dayPlans;
}

export async function POST(request: Request) {
  try {
    const { destination, startDate, endDate } = await request.json();

    // Validate inputs
    if (!destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const suggestedItinerary = await generateSuggestedItinerary(
      destination,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json(suggestedItinerary);
  } catch (error) {
    console.error("Error generating suggested itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate suggested itinerary" },
      { status: 500 }
    );
  }
}