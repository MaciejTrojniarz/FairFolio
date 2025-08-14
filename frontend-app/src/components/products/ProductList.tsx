import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchProductsCommand,
  deleteProductCommand,
} from '../../store/features/products/productsSlice';
import type { Product } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useI18n } from '../../contexts/useI18n';
import { getInitials } from '../../utils/imageHelpers';

interface ProductListProps {
  onEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(fetchProductsCommand());
  }, [dispatch]);

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProductCommand(id));
  };

  const handleViewDetails = (id: string) => {
    navigate(`/products/${id}`);
  };

  // Group products by category
  const categorizedProducts = products.reduce((acc, product) => {
    const categoryId = product.category_id || 'unknown';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('product_list')}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

      {
        Object.keys(categorizedProducts).map((categoryId) => {
          const categoryName = categoryId === 'unknown' ? t('unknown_category') : categorizedProducts[categoryId][0].category_name;
          return (
            <Accordion key={categoryId} defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{categoryName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {categorizedProducts[categoryId].map((product) => (
                    <ListItem key={product.id} divider>
                      <ListItemButton onClick={() => handleViewDetails(product.id)}>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            style={{ width: 56, height: 56, marginRight: 16, objectFit: 'contain' }}
                          />
                        ) : (
                          <Avatar sx={{ width: 56, height: 56, marginRight: 16, bgcolor: '#e0e0e0', color: '#757575' }}>
                            {getInitials(product.name)}
                          </Avatar>
                        )}
                        <ListItemText
                          primary={product.name}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {t('price')}: ${product.price.toFixed(2)} | {t('cost')}: ${product.cost.toFixed(2)}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2" color="text.secondary">
                                {t('description')}: {product.description || t('no_description_provided')}
                              </Typography>
                              {product.stock_quantity !== undefined && (
                                <Typography component="span" variant="body2" color="text.secondary">
                                  <br />{t('stock_quantity')}: {product.stock_quantity}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItemButton>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => onEdit(product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProduct(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })
      }
    </Box>
  );
};

export default ProductList;
