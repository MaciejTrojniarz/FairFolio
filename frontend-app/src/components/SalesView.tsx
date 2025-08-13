import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import {
  fetchProductsCommand
} from '../store/features/products/productsSlice';
import { fetchEventsCommand } from '../store/features/events/eventsSlice';
import {
  addToBasket,
  removeFromBasket,
  clearBasket,
  recordSaleCommand,
} from '../store/features/sales/salesSlice';
import type { Product, BasketItem, Event } from '../types';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventSelector from './common/EventSelector'; // Corrected path

const SalesView: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.products);
  const { loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
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

        <EventSelector
          selectedEventId={selectedEventId}
          onSelectEvent={(id) => setSelectedEventId(id)}
        />

        {/* Main content area - Products and Basket */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}> {/* Main flex container */}

          {/* Product Cards Section */}
          <Box>
            <Typography variant="h5" gutterBottom>Products</Typography>
            <Grid container spacing={2} alignItems="stretch" sx={{ width: '100%' }}> {/* ADD width: '100%' */} {/* Ensure alignItems="stretch" */}
              {products.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id} sx={{ height: '100%', display: 'flex' }}> {/* ADD display: 'flex' back to Grid item */}
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', minHeight: 300 }}> {/* ADD minHeight */} {/* Ensure width: '100%' */}
                    <CardActionArea onClick={() => handleAddToBasket(product)}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: { xs: 100, sm: 140, md: 180 },
                          objectFit: 'contain',
                        }}
                        image={product.image_url || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={product.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}> {/* Ensure flexGrow: 1 */}
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          noWrap // Ensure noWrap
                          title={product.name}
                          sx={{width: '100%'}} // Ensure width: '100%' for Typography
                        >
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
          </Box>

          {/* Basket Section */}
          <Box>
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
          </Box>

        </Box> {/* End Main flex container */}
      </Box>
    </Container>
  );
};

export default SalesView;