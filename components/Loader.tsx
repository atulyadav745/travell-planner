'use client';

import Lottie from 'lottie-react';
import { Box } from '@mui/material';

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

export default function Loader({ size = 200, fullScreen = false }: LoaderProps) {
  const content = (
    <Box width={size} height={size}>
      <Lottie
        animationData={require('../public/loader.json')}
        loop={true}
      />
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        {content}
      </Box>
    );
  }

  return content;
}
