'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Typography } from '@mui/material';
import DraggableActivityCard from './DraggableActivityCard';
import { ScheduledActivity } from '@/types/base';

interface DayColumnProps {
  day: number;
  activities: ScheduledActivity[];
}

export default function DayColumn({ day, activities }: DayColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `day-${day}`, // Give each column a unique ID
  });

  const activityIds = activities.map(a => a.id);

  return (
    <Box
      ref={setNodeRef} // Set this node as a droppable area
      sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, height: '100%' }}
    >
      <Typography variant="h6" gutterBottom align="center">Day {day}</Typography>
      <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
        {activities.map((activity) => (
          <DraggableActivityCard key={activity.id} scheduledActivity={activity} />
        ))}
      </SortableContext>
    </Box>
  );
}
