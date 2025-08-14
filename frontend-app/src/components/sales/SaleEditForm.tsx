import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchProductsCommand,
} from '../../store/features/products/productsSlice';
import {
  fetchEventsCommand,
} from '../../store/features/events/eventsSlice';
import {
  updateSaleCommand,
} from '../../store/features/sales/salesSlice';
import type { Product, DetailedSaleItem, Sale } from '../../types';
import {
  Container,
  Typography,
  Box,
  Button,
  GridLegacy as Grid,
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
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';
import EventSelector from '../events/EventSelector';

interface SaleEditFormProps {
  sale: Sale;
  saleItems: DetailedSaleItem[];
}

const SaleEditForm: React.FC<SaleEditFormProps> = ({ sale, saleItems }) => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.products);
  const { loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);

  const [currentBasket, setCurrentBasket] = useState<DetailedSaleItem[]>(saleItems);
  const [currentTotalAmount, setCurrentTotalAmount] = useState(sale.total_amount);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined | null>(sale.event_id);
  const [comment, setComment] = useState(sale.comment || '');

  useEffect(() => {
    dispatch(fetchProductsCommand());
    dispatch(fetchEventsCommand());
  }, [dispatch]);

  useEffect(() => {
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
            id: `temp-${Date.now()}-${Math.random()}`,
            sale_id: sale.id,
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
    const eventIdToSend = selectedEventId === '' ? null : selectedEventId;

    dispatch(updateSaleCommand({
      saleId: sale.id,
      updatedSaleData: { total_amount: currentTotalAmount, event_id: eventIdToSend, comment: comment },
      updatedSaleItems: currentBasket,
      originalSaleItems: saleItems,
    }));
    navigate(`/sales/${sale.id}`);
  };

  const handleCancel = () => {
    navigate(`/sales/${sale.id}`);
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('edit_sale_title')}: {sale.id}
        </Typography>

        {(productsLoading || salesLoading || eventsLoading) && <CircularProgress />}
        {(productsError || salesError || eventsError) && <Alert severity="error">Error: {productsError || salesError || eventsError}</Alert>}

        <EventSelector
          selectedEventId={selectedEventId}
          onSelectEvent={(id) => setSelectedEventId(id)}
        />
        <TextField
          label={t('comment_label')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mt: 2, mb: 2 }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>{t('products_section_title')}</Typography>
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
            <Typography variant="h5" gutterBottom>{t('current_basket_title')}</Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
              {currentBasket.length === 0 ? (
                <ListItem>
                  <ListItemText primary={t('basket_is_empty_message')} />
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
                  {t('cancel_button')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateSale}
                  startIcon={<SaveIcon />}
                  disabled={salesLoading}
                  sx={{ flexGrow: 1 }}
                >
                  {t('save_changes_button')}
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