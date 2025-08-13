import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchProductsCommand,
  deleteProductCommand,
} from '../../store/features/products/productsSlice';
import type { Product } from '../../types';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ProductListProps {
  onEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductsCommand());
  }, [dispatch]);

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProductCommand(id));
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Product List
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error}</Alert>}

      <List>
        {products.map((product) => (
          <ListItem key={product.id} divider>
            {product.image_url && (
              <Avatar
                src={product.image_url}
                alt={product.name}
                variant="square"
                sx={{ width: 56, height: 56, mr: 2 }}
              />
            )}
            <ListItemText
              primary={product.name}
              secondary={`Price: $${product.price.toFixed(2)} | Cost: $${product.cost.toFixed(2)} | Desc: ${product.description || 'N/A'}`}
            />
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
    </Box>
  );
};

export default ProductList;