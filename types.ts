// From components/ActivityCard.tsx
export interface Activity {
  id: string;
  name: string;
  description: string;
  city: string;
  latitude: number;
  longitude: number;
  typicalDuration: number;
}

// Represents a scheduled activity in the itinerary
export interface ScheduledActivity {
  id: string;
  day: number;
  order: number;
  tripId: string;
  activityId: string;
  activity: Activity; // Include the full activity details
}

// Represents the entire Trip object
export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  selectedActivityIds: string[];
  scheduledActivities: ScheduledActivity[];
}