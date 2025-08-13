import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Product } from '../../types';
import {
  addProductCommand,
  updateProductCommand,
} from '../../store/features/products/productsSlice';
import { productService } from '../../services/productService'; // NEW IMPORT
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
  CircularProgress, // NEW IMPORT
  Alert, // NEW IMPORT
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
  const [notes, setNotes] = useState(product?.notes || '');
  const [link, setLink] = useState(product?.link || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [cost, setCost] = useState(product?.cost.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(product?.image_url || null);
  const [loading, setLoading] = useState(false); // NEW STATE
  const [error, setError] = useState<string | null>(null); // NEW STATE

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setNotes(product.notes || '');
      setLink(product.link || '');
      setPrice(product.price.toString());
      setCost(product.cost.toString());
      setImageUrlPreview(product.image_url || null);
      setImageFile(null); // Clear file input when editing a new product
    } else {
      // Reset form for new product
      setName('');
      setDescription('');
      setNotes('');
      setLink('');
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

  const handleSubmit = async (event: React.FormEvent) => { // Made async
    event.preventDefault();

    setLoading(true); // Add loading state
    setError(null); // Add error state

    let imageUrl: string | undefined = imageUrlPreview || undefined; // Start with existing preview or undefined

    try {
      let currentProductId = product?.id; // Use existing product ID if editing

      if (imageFile) {
        // Generate a UUID for the image filename if adding a new product
        // or use existing product ID for updates
        const imageFileName = currentProductId || crypto.randomUUID(); // Use product ID or new UUID
        imageUrl = await productService.uploadProductImage(imageFile, imageFileName);
      }

      const productData = {
        name,
        description,
        notes,
        link,
        price: parseFloat(price),
        cost: parseFloat(cost),
        image_url: imageUrl, // Include image_url in productData
      };

      if (product) {
        // Update existing product
        dispatch(updateProductCommand({ ...product, ...productData })); // Pass only product data
      } else {
        // Add new product
        dispatch(addProductCommand(productData)); // Pass only product data
      }
      onClose(); // Close form after submission
    } catch (err: any) {
      setError(err.message); // Set error message
      console.error('Error during product submission:', err);
    } finally {
      setLoading(false); // Reset loading state
    }
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
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
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
