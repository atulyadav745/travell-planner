'use client';

import { Container, Typography, Alert, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 4 }}>
        This share link has expired or is invalid.
      </Alert>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Please request a new share link from the trip owner.
      </Typography>
      <Button component={Link} href="/" variant="contained">
        Go to Home Page
      </Button>
    </Container>
  );
}