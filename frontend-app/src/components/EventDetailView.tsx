import React, { useEffect, useState } from 'react'; // Added useState
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { fetchEventsCommand } from '../store/features/events/eventsSlice';
import { fetchSalesCommand } from '../store/features/sales/salesSlice'; // New import
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  List, ListItem, ListItemText, ListItemButton, Avatar, Badge,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, // New imports for modal
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // New import

const EventDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { salesHistory, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const event = events.find(e => e.id === id);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // New state for confirmation modal

  useEffect(() => {
    // Fetch events if not already loaded
    if (events.length === 0 && !eventsLoading && !eventsError) {
      dispatch(fetchEventsCommand());
    }
    // Fetch sales if not already loaded
    if (salesHistory.length === 0 && !salesLoading && !salesError) {
      dispatch(fetchSalesCommand());
    }
  }, [events, eventsLoading, eventsError, salesHistory, salesLoading, salesError, dispatch]);

  const handleDeleteClick = () => {
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (event) {
      dispatch(deleteEventCommand(event.id)); // Dispatch delete command
      setOpenConfirmDelete(false);
      navigate('/events'); // Navigate back to event list after deletion
    }
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  if (eventsLoading || salesLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (eventsError || salesError) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">Error: {eventsError || salesError}</Alert>
          <Button variant="contained" onClick={() => navigate('/events')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">Event not found.</Alert>
          <Button variant="contained" onClick={() => navigate('/events')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  const salesForThisEvent = salesHistory.filter(sale => sale.event_id === id);
  const handleAddSaleToEvent = () => {
    navigate('/sales/record', { state: { eventId: id } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/events')}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Events
          </Button>
          <Box>
            <Button variant="contained" onClick={() => navigate(`/events/${event.id}/edit`)} sx={{ mr: 1 }}>
              <EditIcon sx={{ mr: 1 }} /> Edit Event
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete Event
            </Button>
          </Box>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Details
        </Typography>

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Name: {event.name}</Typography>
          <Typography variant="body1">Description: {event.description || 'N/A'}</Typography>
          <Typography variant="body1">Link: {event.link || 'N/A'}</Typography>
          <Typography variant="body1">Start Date: {new Date(event.start_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">End Date: {new Date(event.end_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">Venue: {event.venue}</Typography>
          <Typography variant="body1">City: {event.city}</Typography>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
          <Typography variant="h5" component="h2">
            Sales for this Event
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSaleToEvent}
          >
            Add Sale
          </Button>
        </Box>

        <List>
          {salesForThisEvent.length === 0 ? (
            <ListItem>
              <ListItemText primary="No sales recorded for this event yet." />
            </ListItem>
          ) : (
            salesForThisEvent.map((sale) => (
              <Paper key={sale.id} elevation={1} sx={{ mb: 1 }}>
                <ListItemButton onClick={() => navigate(`/sales/${sale.id}`)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, py: 1 }}>
                    {sale.items.map((item) => (
                      <Badge key={item.id} badgeContent={item.quantity} color="primary">
                        <Avatar
                          src={item.product_image_url || 'https://via.placeholder.com/50?text=N/A'}
                          alt={item.product_name}
                          variant="square"
                          sx={{ width: 40, height: 40 }}
                        />
                      </Badge>
                    ))}
                    <Typography variant="body1" sx={{ ml: 2, fontWeight: 'bold' }}>
                      Total: ${sale.total_amount.toFixed(2)}
                    </Typography>
                  </Box>
                </ListItemButton>
              </Paper>
            ))
          )}
        </List>
      </Box>

      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the event "{event.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EventDetailView;