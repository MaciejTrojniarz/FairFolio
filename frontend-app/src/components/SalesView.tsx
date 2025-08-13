import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate // Added useNavigate
import type { RootState } from '../store';
import {
  fetchProductsCommand
} from '../store/features/products/productsSlice';
import { fetchEventsCommand } from '../store/features/events/eventsSlice'; // New import
import {
  addToBasket,
  removeFromBasket,
  clearBasket,
  recordSaleCommand,
} from '../store/features/sales/salesSlice';
import type { Product, BasketItem, Event } from '../types'; // Added Event
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  FormControl, InputLabel, Select, MenuItem,
  InputAdornment, // Added InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Added VisibilityIcon

const SalesView: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added
  const location = useLocation();
  const { products, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.products);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { basket, totalAmount, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);

  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchProductsCommand());
    dispatch(fetchEventsCommand());
  }, [dispatch]);

  useEffect(() => {
    // Check if eventId is passed via route state
    if (location.state && (location.state as { eventId?: string }).eventId) {
      setSelectedEventId((location.state as { eventId: string }).eventId);
    }
  }, [location.state]);

  const handleAddToBasket = (product: Product) => {
    dispatch(addToBasket(product));
  };

  const handleRemoveFromBasket = (productId: string) => {
    dispatch(removeFromBasket(productId));
  };

  const handleClearBasket = () => {
    dispatch(clearBasket());
  };

  const handleRecordSale = () => {
    if (basket.length > 0) {
      dispatch(recordSaleCommand(selectedEventId)); // Pass selected event ID
    }
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Record Sale
        </Typography>

        {(productsLoading || salesLoading || eventsLoading) && <CircularProgress />}
        {(productsError || salesError || eventsError) && <Alert severity="error">Error: {productsError || salesError || eventsError}</Alert>}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="event-select-label">Select Event (Optional)</InputLabel>
          <Select
            labelId="event-select-label"
            value={selectedEventId || ''}
            label="Select Event (Optional)"
            onChange={(e) => setSelectedEventId(e.target.value as string)}
            endAdornment={ // Add endAdornment for the button
              selectedEventId && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      console.log('Navigating to event:', selectedEventId);
                      navigate(`/events/${selectedEventId}`);
                    }}
                    edge="end"
                    aria-label="view event details"
                    disabled={!selectedEventId}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {events.map((event: Event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name} ({new Date(event.start_date).toLocaleDateString()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {/* Product Cards */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>Products</Typography>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea onClick={() => handleAddToBasket(product)}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: { xs: 100, sm: 140, md: 180 }, // Responsive height
                          objectFit: 'contain',
                          // Removed p: 1
                        }}
                        image={product.image_url || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Basket */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>Basket</Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
              {basket.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Basket is empty" />
                </ListItem>
              ) : (
                basket.map((item: BasketItem) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={`${item.name} x ${item.quantity}`}
                      secondary={`$${(item.price * item.quantity).toFixed(2)}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveFromBasket(item.id)}>
                        <RemoveIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="add" onClick={() => handleAddToBasket(item)}>
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 1 }}>
              <Typography variant="h6">Total: ${totalAmount.toFixed(2)}</Typography>
              <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearBasket}
                  startIcon={<ClearAllIcon />}
                  disabled={basket.length === 0}
                  sx={{ flexGrow: 1 }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRecordSale}
                  startIcon={<ShoppingCartIcon />}
                  disabled={basket.length === 0 || salesLoading}
                  sx={{ flexGrow: 1 }}
                >
                  Record Sale
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SalesView;