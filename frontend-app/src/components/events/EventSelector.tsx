import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Event } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  FormControl, InputLabel, Select, MenuItem,
  InputAdornment, IconButton, Typography, Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useI18n } from '../../contexts/useI18n';

interface EventSelectorProps {
  selectedEventId: string | undefined | null;
  onSelectEvent: (eventId: string | undefined) => void;
  label?: string;
  allowNone?: boolean;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  selectedEventId,
  onSelectEvent,
  allowNone = true,
}) => {
  const navigate = useNavigate();
  const { events } = useSelector((state: RootState) => state.events);
  const { t } = useI18n();

  const handleViewEventDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedEventId) {
      navigate(`/events/${selectedEventId}`);
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="event-select-label">{t('select_event')}</InputLabel>
      <Select
        labelId="event-select-label"
        value={selectedEventId || ''}
        label={t('select_event')}
        onChange={(e) => onSelectEvent(e.target.value === '' ? undefined : e.target.value as string)}
        endAdornment={
          selectedEventId && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleViewEventDetails}
                edge="end"
                aria-label={t('view_details')}
                disabled={!selectedEventId}
              >
                <VisibilityIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      >
        {allowNone && (
          <MenuItem value="">
            <em>{t('none')}</em>
          </MenuItem>
        )}
        {events.map((event: Event) => (
          <MenuItem key={event.id} value={event.id}>
            <Box>
              <Typography variant="body1">{event.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                {event.city ? `, ${event.city}` : ''}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EventSelector;