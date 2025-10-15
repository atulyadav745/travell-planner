'use client';

import { DndContext, pointerWithin, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay, Active } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Typography, Paper, Grid } from '@mui/material';
import DayColumn from './DayColumn';
import DraggableActivityCard from './DraggableActivityCard';
import { Trip, ScheduledActivity } from '@/types/base';
import { useState, useEffect } from 'react';

interface ItineraryDisplayProps {
  trip: Trip | null;
  onScheduleUpdate: (updatedActivities: Pick<ScheduledActivity, 'id' | 'day' | 'order'>[]) => void;
}

export default function ItineraryDisplay({ trip, onScheduleUpdate }: ItineraryDisplayProps) {
  const [localActivities, setLocalActivities] = useState(trip?.scheduledActivities || []);
  const [activeActivity, setActiveActivity] = useState<ScheduledActivity | null>(null);

  useEffect(() => {
    setLocalActivities(trip?.scheduledActivities || []);
  }, [trip]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require mouse to move 8px before drag starts
      },
    })
  );

  const activitiesByDay = localActivities.reduce((acc, activity) => {
    (acc[activity.day] = acc[activity.day] || []).push(activity);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  const findContainer = (id: string) => {
    if (id.toString().startsWith('day-')) {
        return id;
    }
    for (const day in activitiesByDay) {
        if (activitiesByDay[day].some(act => act.id === id)) {
            return `day-${day}`;
        }
    }
    return null;
  }

  const handleDragStart = (event: { active: Active }) => {
    const activity = localActivities.find(sa => sa.id === event.active.id);
    if(activity) setActiveActivity(activity);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveActivity(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    
    if (!activeContainer || !overContainer) return;

    const activeDay = parseInt(activeContainer.replace('day-', ''));
    const overDay = parseInt(overContainer.replace('day-', ''));

    let newSchedule = [...localActivities];

    if (activeContainer === overContainer) {
        // Reordering within the same day
        const dayActivities = activitiesByDay[activeDay];
        const oldIndex = dayActivities.findIndex(a => a.id === activeId);
        const newIndex = dayActivities.findIndex(a => a.id === overId);
        if (oldIndex !== newIndex) {
            const reordered = arrayMove(dayActivities, oldIndex, newIndex);
            reordered.forEach((act, index) => {
                const itemInSchedule = newSchedule.find(sa => sa.id === act.id);
                if(itemInSchedule) itemInSchedule.order = index;
            });
        }
    } else {
        // Moving to a different day
        const activeItem = newSchedule.find(item => item.id === activeId);
        if (activeItem) {
            activeItem.day = overDay; // Update the day property

            // Find where to insert in the new day's list
            const overDayActivities = activitiesByDay[overDay] || [];
            let newIndexInDay = overDayActivities.findIndex(a => a.id === overId);

            if (overId.startsWith('day-') || newIndexInDay === -1) {
                newIndexInDay = overDayActivities.length;
            }

            activeItem.order = newIndexInDay;
        }
    }
    
    // Create the final, re-ordered schedule for both UI and API
    const finalSchedule = Object.values(activitiesByDay).flat().map(act => {
        const item = newSchedule.find(i => i.id === act.id)!;
        return { id: item.id, day: item.day, order: item.order };
    });
    
    // Re-calculate final order for all days to ensure data integrity
    const itemsByDay: Record<number, typeof finalSchedule> = {};
    finalSchedule.forEach(item => {
        if (!itemsByDay[item.day]) itemsByDay[item.day] = [];
        itemsByDay[item.day].push(item);
    });
    for(const day in itemsByDay) {
        itemsByDay[day].sort((a,b) => a.order - b.order).forEach((item, index) => item.order = index);
    }
    
    const finalOrderedSchedule = Object.values(itemsByDay).flat();
    
    // Update local UI immediately
    setLocalActivities(localActivities.map(act => {
        const updated = finalOrderedSchedule.find(f => f.id === act.id);
        return updated ? {...act, ...updated} : act;
    }));
    
    // Send changes to the backend
    onScheduleUpdate(finalOrderedSchedule);
  };
  
  const dayCount = trip ? new Date(trip.endDate).getDate() - new Date(trip.startDate).getDate() + 1 : 0;
  const daysArray = Array.from({ length: dayCount > 0 ? dayCount : 0 }, (_, i) => i + 1);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h5" gutterBottom>Your Itinerary</Typography>
      {!localActivities || localActivities.length === 0 ? (
        <Typography color="text.secondary">
          Add activities and generate a schedule to see your plan.
        </Typography>
      ) : (
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Grid container spacing={2} sx={{height: '100%'}}>
            {daysArray.map((day) => (
              <Grid item xs={12 / (daysArray.length || 1)} key={day}>
                <DayColumn
                  day={day}
                  activities={(activitiesByDay?.[day] || []).sort((a, b) => a.order - b.order)}
                />
              </Grid>
            ))}
          </Grid>
          <DragOverlay>
            {activeActivity ? <DraggableActivityCard scheduledActivity={activeActivity} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </Paper>
  );
}
