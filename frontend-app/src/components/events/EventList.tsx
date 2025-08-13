import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchEventsCommand,
  deleteEventCommand,
} from '../../store/features/events/eventsSlice';
import type { Event } from '../../types';
import { useNavigate } from 'react-router-dom'; // New import
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // New import

const EventList: React.FC = () => { // Removed onEdit prop
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    dispatch(fetchEventsCommand());
  }, [dispatch]);

  const handleViewDetails = (id: string) => {
    navigate(`/events/${id}`);
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Event List
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

      <List>
        {events.map((event) => (
          <ListItem key={event.id} divider>
            <ListItemText
              primary={event.name}
              secondary={`Venue: ${event.venue}, ${event.city} | ${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view details" onClick={() => handleViewDetails(event.id)}>
                <VisibilityIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventList;