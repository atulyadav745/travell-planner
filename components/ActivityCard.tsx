'use client';

import { Card, CardContent, Typography, Button, CardActions, CircularProgress } from '@mui/material';
import { Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
  onAddToTrip: (activityId: string) => void;
  isSelected: boolean;
  isLoading?: boolean; // New prop to show loading state
}

export default function ActivityCard({ activity, onAddToTrip, isSelected, isLoading = false }: ActivityCardProps) {
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
        <Button 
          size="small" 
          onClick={() => onAddToTrip(activity.id)} 
          disabled={isSelected || isLoading}
          sx={{ minWidth: 100, position: 'relative' }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ position: 'absolute' }} />
              <span style={{ opacity: 0 }}>Adding...</span>
            </>
          ) : isSelected ? (
            'Added'
          ) : (
            'Add to Trip'
          )}
        </Button>
      </CardActions>
    </Card>
  );
}