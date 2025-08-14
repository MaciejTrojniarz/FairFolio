import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Event } from '../../types';
import {
  addEventCommand,
  updateEventCommand,
} from '../../store/features/events/eventsSlice';
import { useI18n } from '../../contexts/useI18n';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

interface EventFormProps {
  event?: Event;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const { t } = useI18n();
  const dispatch = useDispatch();

  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [link, setLink] = useState(event?.link || '');
  const [startDate, setStartDate] = useState(event?.start_date.split('T')[0] || '');
  const [endDate, setEndDate] = useState(event?.end_date.split('T')[0] || '');
  const [venue, setVenue] = useState(event?.venue || '');
  const [city, setCity] = useState(event?.city || '');

  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);


  useEffect(() => {
    if (event) {
      setName(event.name);
      setDescription(event.description || '');
      setLink(event.link || '');
      setStartDate(event.start_date.split('T')[0]);
      setEndDate(event.end_date.split('T')[0]);
      setVenue(event.venue);
      setCity(event.city);
    } else {
      setName('');
      setDescription('');
      setLink('');
      setStartDate('');
      setEndDate('');
      setVenue('');
      setCity('');
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setStartDateError(null);
    setEndDateError(null);

    const start = new Date(startDate);
    const end = new Date(endDate);

    let hasError = false;

    if (start > end) {
      setEndDateError('End date cannot be before start date.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const eventData = {
      name,
      description,
      link,
      start_date: startDate,
      end_date: endDate,
      venue,
      city,
    };

    if (event) {
      dispatch(updateEventCommand({ ...event, ...eventData }));
    } else {
      dispatch(addEventCommand(eventData));
    }
    onClose();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {event ? t('edit_event_form_title') : t('add_new_event_form_title')}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label={t('event_name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label={t('event_description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label={t('event_link')}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
        />
        <TextField
          label={t('event_start_date')}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          error={!!startDateError} // Apply error state
          helperText={startDateError} // Display error message
        />
        <TextField
          label={t('event_end_date')}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          error={!!endDateError} // Apply error state
          helperText={endDateError} // Display error message
        />
        <TextField
          label={t('event_venue')}
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label={t('event_city')}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {event ? t('update_event_button') : t('add_event_button')}
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          {t('cancel_button')}
        </Button>
      </Box>
    </Paper>
  );
};

export default EventForm;