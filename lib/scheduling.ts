import { Activity, ScheduledActivity } from '@/types/base';

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

interface ProximityGroup {
  activities: Activity[];
  centerLat: number;
  centerLon: number;
}

// Group activities by proximity (within 2km of each other)
export function groupActivitiesByProximity(activities: Activity[]): ProximityGroup[] {
  const groups: ProximityGroup[] = [];
  const maxDistance = 2; // 2km radius

  for (const activity of activities) {
    let foundGroup = false;
    
    for (const group of groups) {
      const distance = calculateDistance(
        activity.latitude,
        activity.longitude,
        group.centerLat,
        group.centerLon
      );

      if (distance <= maxDistance) {
        group.activities.push(activity);
        // Recalculate center
        group.centerLat = group.activities.reduce((sum, a) => sum + a.latitude, 0) / group.activities.length;
        group.centerLon = group.activities.reduce((sum, a) => sum + a.longitude, 0) / group.activities.length;
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      groups.push({
        activities: [activity],
        centerLat: activity.latitude,
        centerLon: activity.longitude,
      });
    }
  }

  // Sort activities within each group by priority
  groups.forEach(group => {
    group.activities.sort((a, b) => b.priority - a.priority);
  });

  return groups;
}

// Calculate optimal schedule for a single day
export function calculateDaySchedule(
  activities: Activity[],
  maxDuration: number = 480 // 8 hours in minutes
): Activity[] {
  const schedule: Activity[] = [];
  let currentDuration = 0;

  for (const activity of activities) {
    if (currentDuration + activity.typicalDuration <= maxDuration) {
      schedule.push(activity);
      currentDuration += activity.typicalDuration;
    }
  }

  return schedule;
}

// Distribute activities across multiple days
export function distributeActivities(
  activities: Activity[],
  numberOfDays: number
): ScheduledActivity[] {
  const proximityGroups = groupActivitiesByProximity(activities);
  const scheduledActivities: ScheduledActivity[] = [];
  const maxDailyDuration = 480; // 8 hours in minutes

  // Sort groups by average priority
  proximityGroups.sort((a, b) => {
    const avgPriorityA = a.activities.reduce((sum, act) => sum + act.priority, 0) / a.activities.length;
    const avgPriorityB = b.activities.reduce((sum, act) => sum + act.priority, 0) / b.activities.length;
    return avgPriorityB - avgPriorityA;
  });

  const dailySchedules: Activity[][] = Array.from({ length: numberOfDays }, () => []);
  let currentDay = 0;
  let currentDayDuration = 0;

  // Distribute proximity groups across days
  for (const group of proximityGroups) {
    for (const activity of group.activities) {
      // If adding this activity would exceed daily duration, move to next day
      if (currentDayDuration + activity.typicalDuration > maxDailyDuration) {
        currentDay = (currentDay + 1) % numberOfDays;
        currentDayDuration = 0;
      }

      dailySchedules[currentDay].push(activity);
      currentDayDuration += activity.typicalDuration;
    }

    // Move to next day for next proximity group
    currentDay = (currentDay + 1) % numberOfDays;
    currentDayDuration = 0;
  }

  // Convert to ScheduledActivity format
  dailySchedules.forEach((daySchedule, dayIndex) => {
    daySchedule.forEach((activity, activityIndex) => {
      scheduledActivities.push({
        id: `${activity.id}-${dayIndex}-${activityIndex}`,
        activityId: activity.id,
        day: dayIndex + 1,
        order: activityIndex + 1,
        activity: activity,
        tripId: '', // This will be set by the API when creating the activities
      });
    });
  });

  return scheduledActivities;
}