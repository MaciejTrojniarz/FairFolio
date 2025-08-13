import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {
  fetchProductsCommand,
} from '../store/features/products/productsSlice';
import {
  fetchEventsCommand,
} from '../store/features/events/eventsSlice';
import {
  updateSaleCommand,
} from '../store/features/sales/salesSlice';
import type { Product, DetailedSaleItem, Event, Sale } from '../types';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

interface SaleEditFormProps {
  sale: Sale;
  saleItems: DetailedSaleItem[];
}

const SaleEditForm: React.FC<SaleEditFormProps> = ({ sale, saleItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.products);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);

  const [currentBasket, setCurrentBasket] = useState<DetailedSaleItem[]>(saleItems);
  const [currentTotalAmount, setCurrentTotalAmount] = useState(sale.total_amount);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(sale.event_id);

  useEffect(() => {
    dispatch(fetchProductsCommand());
    dispatch(fetchEventsCommand());
  }, [dispatch]);

  useEffect(() => {
    // Recalculate total amount whenever basket changes
    const newTotal = currentBasket.reduce((sum, item) => sum + item.price_at_sale * item.quantity, 0);
    setCurrentTotalAmount(newTotal);
  }, [currentBasket]);

  const handleAddToBasket = (product: Product) => {
    setCurrentBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.product_id === product.id);
      if (existingItem) {
        return prevBasket.map(item =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevBasket,
          {
            id: `temp-${Date.now()}-${Math.random()}`, // Temporary ID for new item
            sale_id: sale.id, // Associate with current sale
            product_id: product.id,
            quantity: 1,
            price_at_sale: product.price,
            product_name: product.name,
            product_image_url: product.image_url,
            product_cost: product.cost,
          },
        ];
      }
    });
  };

  const handleRemoveFromBasket = (productId: string) => {
    setCurrentBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.product_id === productId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          return prevBasket.map(item =>
            item.product_id === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prevBasket.filter(item => item.product_id !== productId);
        }
      }
      return prevBasket;
    });
  };

  const handleUpdateSale = () => {
    dispatch(updateSaleCommand({
      saleId: sale.id,
      updatedSaleData: { total_amount: currentTotalAmount, event_id: selectedEventId },
      updatedSaleItems: currentBasket,
      originalSaleItems: saleItems, // Pass original items for comparison
    }));
    navigate(`/sales/${sale.id}`); // Navigate back after update
  };

  const handleCancel = () => {
    navigate(`/sales/${sale.id}`); // Navigate back without saving
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Sale: {sale.id}
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
                          height: { xs: 100, sm: 140, md: 180 },
                          objectFit: 'contain',
                          p: 1,
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
            <Typography variant="h5" gutterBottom>Current Basket</Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
              {currentBasket.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Basket is empty" />
                </ListItem>
              ) : (
                currentBasket.map((item: DetailedSaleItem) => (
                  <ListItem key={item.id} divider>
                    {item.product_image_url && (
                      <CardMedia
                        component="img"
                        sx={{ width: 40, height: 40, mr: 1, objectFit: 'contain' }}
                        image={item.product_image_url}
                        alt={item.product_name}
                      />
                    )}
                    <ListItemText
                      primary={`${item.product_name} x ${item.quantity}`}
                      secondary={`$${(item.price_at_sale * item.quantity).toFixed(2)}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveFromBasket(item.product_id)}>
                        <RemoveIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="add" onClick={() => handleAddToBasket(products.find(p => p.id === item.product_id)!)}>
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 1 }}>
              <Typography variant="h6">Total: ${currentTotalAmount.toFixed(2)}</Typography>
              <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  sx={{ flexGrow: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateSale}
                  startIcon={<SaveIcon />}
                  disabled={salesLoading}
                  sx={{ flexGrow: 1 }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SaleEditForm;