import { Container, Typography, Box, Alert } from '@mui/material';
import ShareableItinerary from '@/components/ShareableItinerary';
import { Trip } from '@/types';

// This is a Server Component, so we can fetch data directly.
async function getTripData(tripId: string): Promise<Trip | null> {
  try {
    // Construct the full URL for the API endpoint.
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/trips/${tripId}`, {
        cache: 'no-store' // This ensures we always get the latest version of the itinerary.
    });

    if (!res.ok) {
      console.error(`Failed to fetch trip. Status: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Error in getTripData:', error);
    return null;
  }
}

export default async function SharePage(props: { params: Promise<{ tripId: string }> }) {
  const params = await props.params;
  const trip = await getTripData(params.tripId);

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Itinerary for {trip ? trip.destination : 'a Trip'}
        </Typography>
        {trip && (
            <Typography variant="h5" color="text.secondary">
                {new Date(trip.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' - '}
                {new Date(trip.endDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
        )}
      </Box>

      {!trip ? (
        <Alert severity="error">
          Could not load the trip itinerary. The link may be invalid or the trip may have been deleted.
        </Alert>
      ) : (
        <ShareableItinerary trip={trip} />
      )}
    </Container>
  );
}
