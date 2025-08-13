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
  ListItemButton, // NEW IMPORT
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility'; // REMOVE THIS IMPORT

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

  const handleEditEvent = (id: string) => { // ADDED: handle edit event
    navigate(`/events/${id}/edit`);
  };

  const handleDeleteEvent = (id: string) => { // ADDED: handle delete event
    dispatch(deleteEventCommand(id));
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Event List
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

      <List>
        {events.map((event) => ( // Use events directly
          <ListItem key={event.id} divider> {/* Outer ListItem */}
            <ListItemButton onClick={() => handleViewDetails(event.id)}> {/* Make entire button clickable */}
              <ListItemText
                primary={event.name}
                secondary={`Venue: ${event.venue}, ${event.city} | ${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventList;