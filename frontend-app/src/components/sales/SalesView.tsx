import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState } from '../../store';
import {
  fetchProductsCommand
} from '../../store/features/products/productsSlice';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import {
  addToBasket,
  removeFromBasket,
  clearBasket,
  recordSaleCommand,
} from '../../store/features/sales/salesSlice';
import type { Product, BasketItem } from '../../types';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventSelector from '../events/EventSelector';
import { showToast } from '../../store/features/ui/uiSlice';
import { useI18n } from '../../contexts/useI18n';
import { generateSvgPlaceholder } from '../../utils/imageHelpers';

const SalesView: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.products);
  const { loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { basket, totalAmount, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const { t } = useI18n();

  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [comment, setComment] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const categorizedProducts = products.reduce((acc, product) => {
    const categoryId = product.category_id || 'unknown';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handleAccordionChange = (categoryId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? categoryId : false);
  };

  useEffect(() => {
    dispatch(fetchProductsCommand());
    dispatch(fetchEventsCommand());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(categorizedProducts).length === 1) {
      setExpandedAccordion(Object.keys(categorizedProducts)[0]);
    } else {
      setExpandedAccordion(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  useEffect(() => {
    if (location.state && (location.state as { eventId?: string }).eventId) {
      setSelectedEventId((location.state as { eventId: string }).eventId);
    }
  }, [location.state]);

  const handleAddToBasket = (product: Product) => {
    const existingItem = basket.find(item => item.id === product.id);
    const currentQuantityInBasket = existingItem ? existingItem.quantity : 0;

    if (product.stock_quantity !== undefined && product.stock_quantity <= currentQuantityInBasket) {
      dispatch(showToast({ message: t('insufficient_stock_warning', { productName: product.name }), severity: 'warning' }));
      return;
    }
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
      dispatch(recordSaleCommand({ eventId: selectedEventId, comment: comment }));
    }
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('record_sale_title')}
        </Typography>

        {(productsLoading || salesLoading || eventsLoading) && <CircularProgress />}
        {(productsError || salesError || eventsError) && <Alert severity="error">Error: {productsError || salesError || eventsError}</Alert>}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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
        </Paper>

        {/* Main content area - Products and Basket */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Box>
            <Typography variant="h5" gutterBottom>{t('products_section_title')}</Typography>
            {
              Object.keys(categorizedProducts).map((categoryId) => {
                const categoryName = categoryId === 'unknown' ? t('unknown_category') : categorizedProducts[categoryId][0].category_name;
                return (
                  <Accordion
                    key={categoryId}
                    expanded={expandedAccordion === categoryId || Object.keys(categorizedProducts).length === 1}
                    onChange={handleAccordionChange(categoryId)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{categoryName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} alignItems="stretch" sx={{ width: '100%' }}>
                        {categorizedProducts[categoryId].map((product) => (
                          <Grid item xs={6} sm={4} md={3} key={product.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', minHeight: 300, opacity: product.stock_quantity !== undefined && product.stock_quantity <= 0 ? 0.5 : 1 }}>
                              <CardActionArea onClick={() => handleAddToBasket(product)} disabled={product.stock_quantity !== undefined && product.stock_quantity <= 0}>
                                <CardMedia
                                  component="img"
                                  sx={{
                                    height: { xs: 100, sm: 140, md: 180 },
                                    objectFit: 'contain',
                                  }}
                                  image={product.image_url || generateSvgPlaceholder(product.name)}
                                  alt={product.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                  <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    noWrap
                                    title={product.name}
                                    sx={{width: '100%'}}
                                  >
                                    {product.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ${product.price.toFixed(2)}
                                  </Typography>
                                  {product.stock_quantity !== undefined && (
                                    <Typography variant="body2" color={product.stock_quantity <= 0 ? "error" : "text.secondary"}>
                                      {t('stock_label')}: {product.stock_quantity}
                                    </Typography>
                                  )}
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })
            }
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>{t('basket_section_title')}</Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
              {basket.length === 0 ? (
                <ListItem>
                  <ListItemText primary={t('basket_is_empty_message')} />
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
              <Typography variant="h6">{t('total_label')}: ${totalAmount.toFixed(2)}</Typography>
              <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearBasket}
                  startIcon={<ClearAllIcon />}
                  disabled={basket.length === 0}
                  sx={{ flexGrow: 1 }}
                >
                  {t('clear_button')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRecordSale}
                  startIcon={<ShoppingCartIcon />}
                  disabled={basket.length === 0 || salesLoading}
                  sx={{ flexGrow: 1 }}
                >
                  {t('record_sale_button')}
                </Button>
              </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </Container>
  );
};

export default SalesView;