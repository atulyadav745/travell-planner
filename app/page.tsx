'use client';

import { Container, Box, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import World from '../components/World'; // --- IGNORE ---
export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box sx={{ py: 8 }}>
        <Stack spacing={4} alignItems="center">
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Welcome to Travel Planner
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Create your perfect trip itinerary with our easy-to-use planner. Choose from multiple cities and customize your schedule.
          </Typography>

          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push('/create')}
            sx={{ minWidth: 200, height: 48 }}
          >
            Create New Trip
          </Button>
        </Stack>
      </Box>
      <World/>
    </Container>
  );
}
