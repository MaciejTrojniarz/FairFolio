import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { fetchSaleDetailsCommand } from '../store/features/sales/salesSlice';
import { fetchEventsCommand } from '../store/features/events/eventsSlice'; // New import
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SaleDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedSale, selectedSaleItems, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events); // New

  useEffect(() => {
    if (id) {
      dispatch(fetchSaleDetailsCommand(id));
    }
    dispatch(fetchEventsCommand()); // Fetch events
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
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Sales History
          </Button>
        </Box>
      </Container>
    );
  }

  if (!selectedSale) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">Sale not found.</Alert>
          <Button variant="contained" onClick={() => navigate('/sales')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Sales History
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/sales')}> {/* Changed to /sales */}
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Sales History
          </Button>
          <Button variant="contained" onClick={() => navigate(`/sales/${selectedSale.id}/edit`)}> {/* Changed to /sales/:id/edit */}
            Edit Sale
          </Button>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Sale Details
        </Typography>

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Sale ID: {selectedSale.id}</Typography>
          <Typography variant="body1">Total Amount: ${selectedSale.total_amount.toFixed(2)}</Typography>
          <Typography variant="body1">Date: {new Date(selectedSale.timestamp).toLocaleString()}</Typography>
          {selectedSale.event_id && (
            <Typography variant="body1">
              Event: {events.find(e => e.id === selectedSale.event_id)?.name || 'Unknown Event'}
            </Typography>
          )}
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom>
          Items in Sale
        </Typography>
        <List>
          {selectedSaleItems.length === 0 ? (
            <ListItem>
              <ListItemText primary="No items found for this sale." />
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
                        Price at Sale: ${item.price_at_sale.toFixed(2)}
                      </Typography>
                      {` — Cost: ${item.product_cost.toFixed(2)}`}
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