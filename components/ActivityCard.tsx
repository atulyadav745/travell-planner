'use client';

import { Card, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import Loader from './Loader';
import { Activity } from '@/types/base';

interface ActivityCardProps {
  activity: Activity;
  onAddToTrip: (activityId: string) => void;
  isSelected: boolean;
  isLoading?: boolean; // New prop to show loading state
}

export default function ActivityCard({ activity, onAddToTrip, isSelected, isLoading = false }: ActivityCardProps) {
  return (
    <Card sx={{ 
        mb: 2, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}>
      {activity.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: 200,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            component="img"
            src={activity.imageUrl}
            alt={activity.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {activity.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ~{Math.round(activity.typicalDuration / 60)} hours
        </Typography>
        <Typography variant="body2" sx={{ 
          opacity: 0.8,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {activity.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 1 }}>
        <Button 
          fullWidth
          size="large"
          variant={isSelected ? 'outlined' : 'contained'}
          onClick={() => onAddToTrip(activity.id)} 
          disabled={isSelected || isLoading}
          sx={{ 
            position: 'relative',
            height: 48
          }}
        >
          {isLoading ? (
            <>
              <Loader size={24} />
              <span style={{ visibility: 'hidden' }}>Adding...</span>
            </>
          ) : isSelected ? (
            'Added to Trip'
          ) : (
            'Add to Trip'
          )}
        </Button>
      </CardActions>
    </Card>
  );
}