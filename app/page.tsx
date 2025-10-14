'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

export default function HomePage() {
  const router = useRouter();
  const [destination, setDestination] = useState('Paris'); // Default to Paris for speed
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!destination || !startDate || !endDate) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/trips', {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      const newTripId = response.data.id;

      // Save the trip ID to local storage for convenience
      localStorage.setItem('tripId', newTripId);

      // Redirect to the new trip's planning page
      router.push(`/trip/${newTripId}`);

    } catch (err) {
      console.error('Failed to create trip:', err);
      setError('Failed to create trip. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Travel Itinerary Planner
        </Typography>
        <Typography component="p" variant="subtitle1" sx={{ mt: 1, mb: 2 }}>
          Create a new trip to get started
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="destination"
            label="Destination"
            name="destination"
            autoFocus
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled // Disabled as we only have data for Paris
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="start-date"
            label="Start Date"
            type="date"
            id="start-date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="end-date"
            label="End Date"
            type="date"
            id="end-date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Trip & Start Planning'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
