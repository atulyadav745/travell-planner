'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import CitySelect from '@/components/CitySelect';

export default function CreateTrip() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleCreateTrip = async () => {
    if (!city || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/trips', {
        destination: city,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      router.push(`/trip/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      setError('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Schedule Your New Trip
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Stack spacing={3}>
            <CitySelect
              value={city}
              onChange={setCity}
              disabled={loading}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                disabled={loading}
                disablePast
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                disabled={loading}
                minDate={startDate || undefined}
                disablePast
              />
            </LocalizationProvider>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleCreateTrip}
              disabled={loading || !city || !startDate || !endDate}
              size="large"
              sx={{ 
                minWidth: 200,
                height: 48,
                position: 'relative'
              }}
            >
              {loading ? (
                <>
                  <Box sx={{ 
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CircularProgress size={24} color="inherit" />
                  </Box>
                  Creating...
                </>
              ) : (
                'Create Trip'
              )}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}