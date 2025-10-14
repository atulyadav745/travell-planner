'use client';

import { Container, Typography, Alert, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 4 }}>
        An error occurred while loading the itinerary
      </Alert>
      <Typography variant="body1" sx={{ mb: 4 }}>
        There was a problem loading this shared trip. The link might be invalid or expired.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button onClick={() => reset()} variant="outlined">
          Try Again
        </Button>
        <Button component={Link} href="/" variant="contained">
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
}