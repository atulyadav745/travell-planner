import { Container, Typography, Box, Alert } from '@mui/material';
import ShareableItinerary from '@/components/ShareableItinerary';
import { Trip } from '@/types';
import prisma from '@/lib/prisma'; // Import the prisma client directly

// This is a Server Component, so we can fetch data directly from the database.
async function getTripData(tripId: string): Promise<Trip | null> {
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        scheduledActivities: {
          include: {
            activity: true,
          },
          orderBy: [
            { day: 'asc' },
            { order: 'asc' },
          ],
        },
      },
    });

    // Prisma returns Date objects, but our Trip type expects strings. We need to serialize it.
    if (!trip) return null;
    return JSON.parse(JSON.stringify(trip));

  } catch (error) {
    console.error('Error in getTripData:', error);
    return null;
  }
}

export default async function SharePage({ params }: { params: { tripId: string } }) {
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
