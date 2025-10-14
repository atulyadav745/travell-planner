'use client';

import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Activity } from '@/types'; // Import from our new types file

// Remove the local Activity interface definition as it's now in types.ts

interface ActivityCardProps {
  activity: Activity;
  onAddToTrip: (activityId: string) => void;
  isSelected: boolean; // New prop to check if it's already selected
}

export default function ActivityCard({ activity, onAddToTrip, isSelected }: ActivityCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {activity.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ~{Math.round(activity.typicalDuration / 60)} hours
        </Typography>
        <Typography variant="body2">
          {activity.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onAddToTrip(activity.id)} disabled={isSelected}>
          {isSelected ? 'Added' : 'Add to Trip'}
        </Button>
      </CardActions>
    </Card>
  );
}