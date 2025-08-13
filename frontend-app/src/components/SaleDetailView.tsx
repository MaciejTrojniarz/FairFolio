import React, { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { fetchSaleDetailsCommand } from '../store/features/sales/salesSlice';
import { fetchEventsCommand } from '../store/features/events/eventsSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Avatar,
  Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import { useI18n } from '../contexts/I18nContext';

const SaleDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedSale, selectedSaleItems, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { t } = useI18n();

  useEffect(() => {
    if (id) {
      dispatch(fetchSaleDetailsCommand(id));
    }
    dispatch(fetchEventsCommand());
  }, [id, dispatch]);

  if (salesLoading || eventsLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (salesError || eventsError) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">Error: {salesError || eventsError}</Alert>
          <Button variant="contained" onClick={() => navigate('/sales')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_sales_history')}
          </Button>
        </Box>
      </Container>
    );
  }

  if (!selectedSale) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">{t('sale_not_found')}</Alert>
          <Button variant="contained" onClick={() => navigate('/sales')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_sales_history')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/sales')}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_sales_history')}
          </Button>
          <Button variant="contained" onClick={() => navigate(`/sales/${selectedSale.id}/edit`)}>
            {t('edit_sale')}
          </Button>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('sale_details')}
        </Typography>

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">{t('sale_id')}: {selectedSale.id}</Typography>
          <Typography variant="body1">{t('total_amount')}: ${selectedSale.total_amount.toFixed(2)}</Typography>
          <Typography variant="body1">{t('date')}: {new Date(selectedSale.timestamp).toLocaleString()}</Typography>
          {selectedSale.comment && (
            <Typography variant="body1"><strong>{t('comment')}:</strong> {selectedSale.comment}</Typography>
          )}
          {selectedSale.event_id && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>{t('event')}:</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<LaunchIcon />}
                onClick={() => navigate(`/events/${selectedSale.event_id}`)}
              >
                {events.find(e => e.id === selectedSale.event_id)?.name || t('unknown_event')}
              </Button>
            </Box>
          )}
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom>
          {t('items_in_sale')}
        </Typography>
        <List>
          {selectedSaleItems.length === 0 ? (
            <ListItem>
              <ListItemText primary={t('no_items_found')} />
            </ListItem>
          ) : (
            selectedSaleItems.map((item) => (
              <ListItem key={item.id} divider>
                {item.product_image_url && (
                  <Avatar
                    src={item.product_image_url}
                    alt={item.product_name}
                    variant="square"
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                )}
                <ListItemText
                  primary={`${item.product_name} (x${item.quantity})`}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {t('price_at_sale')}: ${item.price_at_sale.toFixed(2)}
                      </Typography>
                      {` — ${t('cost_at_sale')}: ${item.product_cost.toFixed(2)}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Container>
  );
};

export default SaleDetailView;