'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Snackbar, // Import Snackbar for feedback
  IconButton, // Import IconButton for the share icon
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share'; // Import the Share Icon
import ActivityCard from '@/components/ActivityCard';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import { Activity, Trip, ScheduledActivity } from '@/types/base';

export default function TripPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState<Record<string, boolean>>({});
  // State for the "Link Copied" notification
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false);

  const generateShareLink = async () => {
    try {
      setIsGeneratingShareLink(true);
      const response = await axios.post('/api/trips/share', { tripId });
      const { token } = response.data;
      const shareUrl = `${window.location.origin}/share/${token}`;
      setShareUrl(shareUrl);
      await navigator.clipboard.writeText(shareUrl);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      setError('Failed to generate share link.');
    } finally {
      setIsGeneratingShareLink(false);
    }
  };

  const handleShareClick = () => {
    if (!shareUrl) {
      generateShareLink();
    } else {
      navigator.clipboard.writeText(shareUrl);
      setOpenSnackbar(true);
    }
  };

  const fetchTripData = useCallback(async () => {
    if (!tripId) return;
    try {
      const response = await axios.get(`/api/trips/${tripId}`);
      setTrip(response.data);
    } catch (err) {
      console.error('Failed to fetch trip data:', err);
      setError('Could not load trip data.');
    }
  }, [tripId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tripResponse = await axios.get(`/api/trips/${tripId}`);
        setTrip(tripResponse.data);
        
        // Only fetch activities after we have the trip data
        if (tripResponse.data?.destination) {
          const activitiesResponse = await axios.get(`/api/activities?city=${tripResponse.data.destination}`);
          setActivities(activitiesResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Could not load trip data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [tripId]);

  // ... (handleAddToTrip, handleGenerateSchedule, and handleScheduleUpdate functions remain the same)
  const handleAddToTrip = async (activityId: string) => {
    // Set loading state for this specific activity
    setLoadingActivities(prev => ({ ...prev, [activityId]: true }));
    
    try {
      const response = await axios.post(`/api/trips/${tripId}/select-activity`, { activityId });
      setTrip(response.data);
    } catch (err) {
      console.error('Failed to add activity:', err);
      setError('Could not add activity to trip. Please try again.');
    } finally {
      // Clear loading state for this activity
      setLoadingActivities(prev => ({ ...prev, [activityId]: false }));
    }
  };
  const handleGenerateSchedule = async () => {
      setIsGenerating(true);
      setError(null);
      try {
          await axios.post(`/api/trips/${tripId}/generate-schedule`);
          await fetchTripData();
      } catch (err) {
          console.error('Failed to generate schedule:', err);
          setError('Failed to generate schedule. Make sure you have selected at least one activity.');
      } finally {
          setIsGenerating(false);
      }
  };
  const handleScheduleUpdate = async (updatedActivities: Pick<ScheduledActivity, 'id' | 'day' | 'order'>[]) => {
      if (!trip) return;
      const updatedTrip = {
          ...trip,
          scheduledActivities: trip.scheduledActivities.map(sa => {
              const updatedActivity = updatedActivities.find(ua => ua.id === sa.id);
              return updatedActivity ? { ...sa, ...updatedActivity } : sa;
          })
      };
      setTrip(updatedTrip);
      try {
          await axios.put(`/api/trips/${tripId}/update-schedule`, updatedActivities);
      } catch (err) {
          console.error('Failed to update schedule:', err);
          setError('Failed to save schedule changes. Reverting.');
          fetchTripData();
      }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Plan Your Trip to {trip?.destination || '...'}
        </Typography>
        {/* =============================================================== */}
        {/* FINAL STEP: Add the Share Button and "Reset" Button to the UI */}
        {/* =============================================================== */}
        <Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateSchedule}
                disabled={isGenerating || !trip?.selectedActivityIds?.length}
                sx={{ mr: 2 }}
            >
                {isGenerating ? <CircularProgress size={24} color="inherit" /> : 'Reset & Optimize'}
            </Button>
            <Button 
                variant="outlined" 
                startIcon={isGeneratingShareLink ? <CircularProgress size={20} /> : <ShareIcon />}
                onClick={handleShareClick}
                disabled={isGeneratingShareLink}
            >
                Share
            </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 150px)' }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>Available Activities</Typography>
          <Box sx={{ height: '100%', overflowY: 'auto', pr: 1 }}>
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onAddToTrip={handleAddToTrip}
                isSelected={trip?.selectedActivityIds.includes(activity.id) || false}
                isLoading={loadingActivities[activity.id] || false}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <ItineraryDisplay trip={trip} onScheduleUpdate={handleScheduleUpdate} />
        </Grid>
      </Grid>
      
      {/* ============================================================= */}
      {/* FINAL STEP: Add the Snackbar component for copy notification  */}
      {/* ============================================================= */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message="Shareable link copied to clipboard!"
      />
    </Container>
  );
}

