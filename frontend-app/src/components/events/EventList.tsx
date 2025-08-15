import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchEventsCommand, } from '../../store/features/events/eventsSlice';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  ListItemButton,
} from '@mui/material';
import { useI18n } from '../../contexts/useI18n';

const EventList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(fetchEventsCommand());
  }, [dispatch]);

  const handleViewDetails = (id: string) => {
    navigate(`/events/${id}`);
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('event_list')}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

      {events.length === 0 ? (
        <Typography variant="body1" color="text.secondary">{t('no_events')}</Typography>
      ) : (
        <List>
          {events.map((event) => (
            <ListItem key={event.id} divider>
              <ListItemButton onClick={() => handleViewDetails(event.id)}>
                <ListItemText
                  primary={event.name}
                  secondary={`${t('venue')}: ${event.venue}, ${event.city} | ${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default EventList;
