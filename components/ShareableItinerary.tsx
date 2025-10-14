'use client';

import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Trip, ScheduledActivity } from '@/types/base';

interface ShareableItineraryProps {
  trip: Trip | null;
}

export default function ShareableItinerary({ trip }: ShareableItineraryProps) {
  // Group scheduled activities by day for display
  const activitiesByDay = trip?.scheduledActivities.reduce((acc, activity) => {
    (acc[activity.day] = acc[activity.day] || []).push(activity);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  // Calculate the number of days for the grid layout
  const dayCount = trip ? new Date(trip.endDate).getDate() - new Date(trip.startDate).getDate() + 1 : 0;
  const daysArray = Array.from({ length: dayCount > 0 ? dayCount : 0 }, (_, i) => i + 1);

  return (
    <Paper elevation={0} sx={{ p: 2, backgroundColor: 'transparent' }}>
      {!trip || trip.scheduledActivities.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          This itinerary is currently empty.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {daysArray.map((day) => (
            <Grid item xs={12} md={12 / (daysArray.length || 1)} key={day}>
              <Box>
                <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
                  Day {day}
                </Typography>
                {(activitiesByDay?.[day] || [])
                  .sort((a, b) => a.order - b.order)
                  .map((scheduledActivity) => (
                    <Card key={scheduledActivity.id} sx={{ mb: 2 }} variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{scheduledActivity.activity.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {scheduledActivity.activity.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
