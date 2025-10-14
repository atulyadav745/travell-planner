export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  selectedActivityIds: string[];
  scheduledActivities: ScheduledActivity[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  city: string;
  latitude: number;
  longitude: number;
  typicalDuration: number;
}

export interface ScheduledActivity {
  id: string;
  day: number;
  order: number;
  tripId: string;
  activityId: string;
  activity: Activity;
}