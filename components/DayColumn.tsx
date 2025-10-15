'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Typography } from '@mui/material';
import DraggableActivityCard from './DraggableActivityCard';
import { ScheduledActivity } from '@/types/base';

interface DayColumnProps {
  day: number;
  activities: ScheduledActivity[];
  onDelete?: (id: string) => Promise<void>;
}

export default function DayColumn({ day, activities, onDelete }: DayColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `day-${day}`, // Give each column a unique ID
  });

  // Filter out any activities without IDs and get their IDs
  const activityIds = activities
    .filter(a => a.id !== undefined)
    .map(a => a.id as string);

  return (
    <Box
      ref={setNodeRef} // Set this node as a droppable area
      sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, height: '100%' }}
    >
      <Typography variant="h6" gutterBottom align="center">Day {day}</Typography>
      <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
                {activities.map((activity) => (
          <DraggableActivityCard 
            key={activity.id} 
            scheduledActivity={activity}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </Box>
  );
}
