import { Container, Typography, Box, Alert } from '@mui/material';
import ShareableItinerary from '@/components/ShareableItinerary';
import { Trip } from '@/types';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { notFound } from 'next/navigation';

// Function to fetch and validate trip data using the share token
async function getTripDataFromToken(token: string): Promise<Trip | null> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Find the share token in the database
    const shareToken = await prisma.shareToken.findUnique({
      where: { token },
      include: {
        trip: {
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
        },
      },
    });

    if (!shareToken || !shareToken.trip) return null;

    // Check if token has expired
    if (shareToken.expiresAt < new Date()) {
      return null;
    }

    // Verify JWT
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }

    // Serialize the data for Next.js
    return JSON.parse(JSON.stringify(shareToken.trip));
  } catch (error) {
    console.error('Error fetching trip data:', error);
    return null;
  }
}

interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const trip = await getTripDataFromToken(token);

  if (!trip) {
    notFound();
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Itinerary for {trip.destination}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {new Date(trip.startDate).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' - '}
          {new Date(trip.endDate).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>
      </Box>

      <ShareableItinerary trip={trip} />
    </Container>
  );
}