import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchProductsCommand,
  deleteProductCommand,
} from '../../store/features/products/productsSlice';
import type { Product } from '../../types';
import { useNavigate } from 'react-router-dom'; // NEW IMPORT
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
  ListItemButton, // NEW IMPORT
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ProductListProps {
  onEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductsCommand());
  }, [dispatch]);

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProductCommand(id));
  };

  const handleViewDetails = (id: string) => { // NEW: handle view details
    navigate(`/products/${id}`);
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
            <ListItemButton onClick={() => handleViewDetails(product.id)}> {/* Make entire button clickable */}
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: 56, height: 56, marginRight: 16, objectFit: 'contain' }}
                />
              )}
              <ListItemText
                primary={product.name}
                secondary={`Price: ${product.price.toFixed(2)} | Cost: ${product.cost.toFixed(2)} | Desc: ${product.description || 'N/A'}`}
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
    </Box>
  );
};

export default ProductList;