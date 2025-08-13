import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Event } from '../../types';
import {
  addEventCommand,
  updateEventCommand,
} from '../../store/features/events/eventsSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

interface EventFormProps {
  event?: Event; // Optional, for editing existing events
  onClose: () => void; // Callback to close form/dialog
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [link, setLink] = useState(event?.link || '');
  const [startDate, setStartDate] = useState(event?.start_date.split('T')[0] || ''); // Format for date input
  const [endDate, setEndDate] = useState(event?.end_date.split('T')[0] || ''); // Format for date input
  const [venue, setVenue] = useState(event?.venue || '');
  const [city, setCity] = useState(event?.city || '');

  const [startDateError, setStartDateError] = useState<string | null>(null); // NEW STATE
  const [endDateError, setEndDateError] = useState<string | null>(null); // NEW STATE


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
      // Reset form for new event
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

    // Reset errors
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
      return; // Prevent form submission if there are errors
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
        {event ? 'Edit Event' : 'Add New Event'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
        />
        <TextField
          label="Start Date"
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
          label="End Date"
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
          label="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {event ? 'Update Event' : 'Add Event'}
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default EventForm;