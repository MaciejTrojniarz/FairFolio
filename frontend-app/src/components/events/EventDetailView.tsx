import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchEventsCommand, deleteEventCommand } from '../../store/features/events/eventsSlice';
import { fetchSalesCommand } from '../../store/features/sales/salesSlice';
import { fetchCostsCommand, recordCostCommand } from '../../store/features/costs/costsSlice';
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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useI18n } from '../../contexts/useI18n';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { arrayToCsv, downloadCsv } from '../../utils/csv';

const EventDetailView: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { salesHistory, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const { costs, loading: costsLoading, error: costsError } = useSelector((state: RootState) => state.costs);
  const event = events.find(e => e.id === id);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const eventsRequestedRef = useRef(false);
  const salesRequestedRef = useRef(false);
  const costsRequestedRef = useRef(false);

  useEffect(() => {
    if (!eventsRequestedRef.current && events.length === 0 && !eventsLoading && !eventsError) {
      eventsRequestedRef.current = true;
      dispatch(fetchEventsCommand());
    }
  }, [events.length, eventsLoading, eventsError, dispatch]);

  useEffect(() => {
    // Only fetch sales if we actually have an event to show
    if (event && !salesRequestedRef.current && salesHistory.length === 0 && !salesLoading && !salesError) {
      salesRequestedRef.current = true;
      dispatch(fetchSalesCommand());
    }
  }, [event, salesHistory.length, salesLoading, salesError, dispatch]);

  useEffect(() => {
    if (event && !costsRequestedRef.current && costs.length === 0 && !costsLoading && !costsError) {
      costsRequestedRef.current = true;
      dispatch(fetchCostsCommand());
    }
  }, [event, costs.length, costsLoading, costsError, dispatch]);

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

  const isLoading = eventsLoading || (event && (salesLoading || costsLoading));
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (eventsError || salesError || costsError) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">Error: {eventsError || salesError || costsError}</Alert>
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
          <Alert severity="warning">{t('event_not_found_after_load')}</Alert>
          <Button variant="contained" onClick={() => navigate('/events')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_events')}
          </Button>
        </Box>
      </Container>
    );
  }

  const salesForThisEvent = salesHistory.filter(sale => sale.event_id === id);
  const costsForThisEvent = costs.filter(c => c.event_id === id);
  const totalSalesAmount = salesForThisEvent.reduce((sum, s) => sum + s.total_amount, 0);
  const totalCostsAmount = costsForThisEvent.reduce((sum, c) => sum + c.amount, 0);
  const netProfit = totalSalesAmount - totalCostsAmount;
  const handleExportCsv = () => {
    const headers = ['sale_id','timestamp','event_id','event_name','item_product_id','item_product_name','item_quantity','item_price_at_sale','sale_total_amount','sale_comment'];
    const rows: (string | number)[][] = [];
    salesForThisEvent.forEach((sale) => {
      if (!event) return;
      if (!sale.items || sale.items.length === 0) {
        rows.push([
          sale.id,
          sale.timestamp,
          sale.event_id || '',
          event.name,
          '', '', '', '',
          sale.total_amount,
          sale.comment || '',
        ]);
      } else {
        sale.items.forEach((item) => {
          rows.push([
            sale.id,
            sale.timestamp,
            sale.event_id || '',
            event.name,
            item.product_id,
            item.product_name,
            item.quantity,
            item.price_at_sale,
            sale.total_amount,
            sale.comment || '',
          ]);
        });
      }
    });
    const csv = arrayToCsv(headers, rows);
    const filename = `event_${event?.name?.replace(/\s+/g,'_') || 'unknown'}_${new Date().toISOString().slice(0,10)}.csv`;
    downloadCsv(filename, csv);
  };
  const handleAddSaleToEvent = () => {
    navigate('/sales/record', { state: { eventId: id } });
  };

  const handleQuickAddCost = () => {
    if (!id) return;
    const todayIso = new Date().toISOString().slice(0, 10);
    dispatch(recordCostCommand({ eventId: id, name: 'Booth Fee', category: 'Booth', amount: 0, date: todayIso }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/events')}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_events')}
          </Button>
          <Box>
            <Button variant="outlined" onClick={handleExportCsv} sx={{ mr: 1 }}>
              {t('export_csv_button')}
            </Button>
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('total_sales_label')}: ${totalSalesAmount.toFixed(2)} | {t('total_costs_label')}: ${totalCostsAmount.toFixed(2)} | {t('net_profit_label')}: ${netProfit.toFixed(2)}
            </Typography>
          </Box>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
          <Typography variant="h5" component="h2">
            {t('costs_history_title')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AttachMoneyIcon />}
            onClick={handleQuickAddCost}
          >
            {t('add_cost_button')}
          </Button>
        </Box>
        <List>
          {costsForThisEvent.length === 0 ? (
            <ListItem>
              <ListItemText primary={t('no_costs_recorded_yet')} />
            </ListItem>
          ) : (
            costsForThisEvent.map((c) => (
              <Paper key={c.id} elevation={1} sx={{ mb: 1 }}>
                <ListItem>
                  <ListItemText
                    primary={`${c.name}${c.category ? ` · ${c.category}` : ''}`}
                    secondary={`${new Date(c.date).toLocaleDateString()} — $${c.amount.toFixed(2)}`}
                  />
                </ListItem>
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