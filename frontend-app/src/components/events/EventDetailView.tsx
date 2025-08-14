import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchEventsCommand, deleteEventCommand } from '../../store/features/events/eventsSlice';
import { fetchSalesCommand } from '../../store/features/sales/salesSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  List, ListItem, ListItemText, ListItemButton, Avatar, Badge,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useI18n } from '../../contexts/useI18n';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EventDetailView: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { salesHistory, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const event = events.find(e => e.id === id);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  useEffect(() => {
    if (events.length === 0 && !eventsLoading && !eventsError) {
      dispatch(fetchEventsCommand());
    }
    if (salesHistory.length === 0 && !salesLoading && !salesError) {
      dispatch(fetchSalesCommand());
    }
  }, [events, eventsLoading, eventsError, salesHistory, salesLoading, salesError, dispatch]);

  const handleDeleteClick = () => {
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (event) {
      dispatch(deleteEventCommand(event.id));
      setOpenConfirmDelete(false);
      navigate('/events');
    }
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleVenueClick = () => {
    if (event) {
      const address = `${event.venue}, ${event.city}`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(googleMapsUrl, '_blank');
    }
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
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_events')}
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
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_events')}
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
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_events')}
          </Button>
          <Box>
            <Button variant="contained" onClick={() => navigate(`/events/${event.id}/edit`)} sx={{ mr: 1 }}>
              <EditIcon sx={{ mr: 1 }} /> {t('edit_event')}
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              <DeleteIcon sx={{ mr: 1 }} /> {t('delete_event')}
            </Button>
          </Box>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('event_details_title')}
        </Typography>

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">{t('event_name')}: {event.name}</Typography>
          <Typography variant="body1">{t('event_description')}: {event.description || 'N/A'}</Typography>
          <Typography variant="body1">{t('event_link')}: {event.link || 'N/A'}</Typography>
          <Typography variant="body1">{t('event_start_date')}: {new Date(event.start_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">{t('event_end_date')}: {new Date(event.end_date).toLocaleDateString()}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">{t('event_venue')}: {event.venue}</Typography>
            <LocationOnIcon sx={{ cursor: 'pointer' }} onClick={handleVenueClick} />
          </Box>
          <Typography variant="body1">{t('event_city')}: {event.city}</Typography>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
          <Typography variant="h5" component="h2">
            {t('sales_for_this_event')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSaleToEvent}
          >
            {t('add_sale_button')}
          </Button>
        </Box>

        <List>
          {salesForThisEvent.length === 0 ? (
            <ListItem>
              <ListItemText primary={t('no_sales_recorded_for_event')} />
            </ListItem>
          ) : (
            salesForThisEvent.map((sale) => (
              <Paper key={sale.id} elevation={1} sx={{ mb: 1 }}>
                <ListItemButton onClick={() => navigate(`/sales/${sale.id}`)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 1, py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
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
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
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
        <DialogTitle id="alert-dialog-title">{t('confirm_deletion_event')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('are_you_sure_delete_event_confirm', { eventName: event?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>{t('cancel_button')}</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t('delete_button')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EventDetailView;