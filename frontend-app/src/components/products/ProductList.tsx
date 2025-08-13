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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useI18n } from '../../contexts/I18nContext'; // NEW IMPORT

interface ProductListProps {
  onEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const { t } = useI18n(); // NEW: useI18n hook

  useEffect(() => {
    dispatch(fetchProductsCommand());
  }, [dispatch]);

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProductCommand(id));
  };

  const handleViewDetails = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('product_list')}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

      <List>
        {products.map((product) => (
          <ListItem key={product.id} divider>
            <ListItemButton onClick={() => handleViewDetails(product.id)}>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: 56, height: 56, marginRight: 16, objectFit: 'contain' }}
                />
              )}
              <ListItemText
                primary={product.name}
                secondary={`${t('price')}: ${product.price.toFixed(2)} | ${t('cost')}: ${product.cost.toFixed(2)} | ${t('description')}: ${product.description || t('no_description_provided')}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProductList;
