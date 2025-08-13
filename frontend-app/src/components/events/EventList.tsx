import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchEventsCommand,
  deleteEventCommand,
} from '../../store/features/events/eventsSlice';
import type { Event } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  ListItemButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useI18n } from '../../contexts/I18nContext';

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

  const handleEditEvent = (id: string) => {
    navigate(`/events/${id}/edit`);
  };

  const handleDeleteEvent = (id: string) => {
    dispatch(deleteEventCommand(id));
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('event_list')}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

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
    </Box>
  );
};

export default EventList;
