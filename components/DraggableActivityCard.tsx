'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { ScheduledActivity } from '@/types/base';
import { useState } from 'react';

interface DraggableActivityCardProps {
  scheduledActivity: ScheduledActivity;
  onDelete?: (id: string) => Promise<void>;
}

export default function DraggableActivityCard({ scheduledActivity, onDelete }: DraggableActivityCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: scheduledActivity.id || `temp-${scheduledActivity.activityId}-${scheduledActivity.day}-${scheduledActivity.order}`
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as 'relative',
  };

  const handleDelete = async () => {
    if (!onDelete || !scheduledActivity.id) return;
    setIsDeleting(true);
    try {
      await onDelete(scheduledActivity.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card ref={setNodeRef} style={style} sx={{ mb: 1, touchAction: 'none' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: '10px !important', gap: 1 }}>
          <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
            <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
             
          </Box>
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{ padding: 0 }}
            >
              <DeleteIcon fontSize="small" sx={{ color: 'text.primary', '&:hover': { color: 'error.main',zIndex:10 } }} />
            </IconButton>
          )}
          {/* <DeleteIcon fontSize="small" sx={{ color: 'text.primary', '&:hover': { color: 'error.main'} }} /> */}
          <Typography variant="body1" sx={{ flexGrow: 1 }}>{scheduledActivity.activity.name}</Typography>
          {/* {onDelete && (
            <IconButton
              size="small"
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{ padding: 0 }}
            >
              <DeleteIcon fontSize="small" sx={{ color: 'text.primary', '&:hover': { color: 'error.main',zIndex:10 } }} />
            </IconButton>
          )} */}
        </CardContent>
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove Activity</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {scheduledActivity.activity.name} from day {scheduledActivity.day}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}