import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Product } from '../../types';
import {
  addProductCommand,
  updateProductCommand,
} from '../../store/features/products/productsSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface ProductFormProps {
  product?: Product; // Optional, for editing existing products
  onClose: () => void; // Callback to close form/dialog
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [cost, setCost] = useState(product?.cost.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(product?.image_url || null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setCost(product.cost.toString());
      setImageUrlPreview(product.image_url || null);
      setImageFile(null); // Clear file input when editing a new product
    } else {
      // Reset form for new product
      setName('');
      setDescription('');
      setPrice('');
      setCost('');
      setImageFile(null);
      setImageUrlPreview(null);
    }
  }, [product]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const productData = {
      name,
      description,
      price: parseFloat(price),
      cost: parseFloat(cost),
    };

    if (product) {
      // Update existing product
      dispatch(updateProductCommand({ ...product, ...productData }, imageFile));
    } else {
      // Add new product
      dispatch(addProductCommand(productData, imageFile));
    }
    onClose(); // Close form after submission
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {product ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          label="Cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          fullWidth
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
          >
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imageUrlPreview && (
            <Avatar src={imageUrlPreview} alt="Product Image" variant="square" sx={{ width: 56, height: 56 }} />
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductForm;