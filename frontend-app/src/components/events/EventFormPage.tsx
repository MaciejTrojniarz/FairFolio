import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import type { Event } from '../../types';
import { Container, CircularProgress, Alert } from '@mui/material';
import { showToast } from '../../store/features/ui/uiSlice';
import { useI18n } from '../../contexts/useI18n';
import EventForm from './EventForm';

const EventFormPage: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);

  useEffect(() => {
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
        console.error(`Event with ID ${id} not found.`);
        dispatch(showToast({ message: t('event_not_found_message'), severity: 'error' }));
        navigate('/events');
      }
    } else if (!id) {
      setEventToEdit(undefined);
    }
  }, [id, events, loading, navigate, dispatch, t]);

  const handleClose = () => {
    if (id) {
      navigate(`/events/${id}`);
    } else {
      navigate('/events');
    }
  };

  if (id && loading) {
    return <Container maxWidth="md"><CircularProgress /></Container>;
  }

  if (id && error) {
    return <Container maxWidth="md"><Alert severity="error">Error loading event: {error}</Alert></Container>;
  }

  if (id && !eventToEdit && !loading) {
    return <Container maxWidth="md"><Alert severity="warning">{t('event_not_found_after_load')}</Alert></Container>;
  }

  return (
    <Container maxWidth="md">
      <EventForm event={eventToEdit} onClose={handleClose} />
    </Container>
  );
};

export default EventFormPage;