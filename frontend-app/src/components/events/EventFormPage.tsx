import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import type { Event } from '../../types';
import { Container, CircularProgress, Alert } from '@mui/material';
import EventForm from './EventForm';

const EventFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);

  useEffect(() => {
    // Ensure events are loaded to find the one to edit
    if (events.length === 0 && !loading && !error) {
      dispatch(fetchEventsCommand());
    }
  }, [events, loading, error, dispatch]);

  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find(e => e.id === id);
      if (foundEvent) {
        setEventToEdit(foundEvent);
      } else if (!loading) {
        // If event not found and not loading, navigate back or show error
        console.error(`Event with ID ${id} not found.`);
        navigate('/events'); // Navigate back to list if not found
      }
    } else if (!id) {
      // For new event creation, ensure no event is set for editing
      setEventToEdit(undefined);
    }
  }, [id, events, loading, navigate]);

  const handleClose = () => {
    if (id) {
      navigate(`/events/${id}`); // Navigate to event details after edit
    } else {
      navigate('/events'); // Navigate to event list after add
    }
  };

  if (id && loading) {
    return <Container maxWidth="md"><CircularProgress /></Container>;
  }

  if (id && error) {
    return <Container maxWidth="md"><Alert severity="error">Error loading event: {error}</Alert></Container>;
  }

  if (id && !eventToEdit && !loading) {
    // This case handles when an event ID is in the URL but the event isn't found after loading
    return <Container maxWidth="md"><Alert severity="warning">Event not found.</Alert></Container>;
  }

  return (
    <Container maxWidth="md">
      <EventForm event={eventToEdit} onClose={handleClose} />
    </Container>
  );
};

export default EventFormPage;