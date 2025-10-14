'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ScheduledActivity } from '@/types';

interface DraggableActivityCardProps {
  scheduledActivity: ScheduledActivity;
}

export default function DraggableActivityCard({ scheduledActivity }: DraggableActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scheduledActivity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as 'relative',
  };

  return (
    <Card ref={setNodeRef} style={style} sx={{ mb: 1, touchAction: 'none' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: '10px !important' }}>
        <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <DragIndicatorIcon sx={{ mr: 1, color: 'text.secondary' }} />
        </Box>
        <Typography variant="body1">{scheduledActivity.activity.name}</Typography>
      </CardContent>
    </Card>
  );
}