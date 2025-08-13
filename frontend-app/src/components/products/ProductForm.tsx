import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '../../types';
import {
  addProductCommand,
  updateProductCommand,
} from '../../store/features/products/productsSlice';
import { productService } from '../../services/productService'; // NEW IMPORT

import { addCategoryCommand, fetchCategoriesCommand } from '../../store/features/categories/categoriesSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import type { RootState } from '../../store';

interface ProductFormProps {
  product?: Product; // Optional, for editing existing products
  onClose: () => void; // Callback to close form/dialog
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const { loading: categoriesLoading } = useSelector((state: RootState) => state.categories);

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [notes, setNotes] = useState(product?.notes || '');
  const [link, setLink] = useState(product?.link || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [cost, setCost] = useState(product?.cost.toString() || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity?.toString() || '0');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | ''>(
    product?.category_id || ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(product?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openNewCategoryDialog, setOpenNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    dispatch(fetchCategoriesCommand());
  }, [dispatch]);

  // Effect to automatically select the newly added category
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && newCategoryName === '') {
      // Find the category that was just added (assuming it's the last one or has a new ID)
      // This might need refinement if categories are not always added to the end
      const newlyAddedCategory = categories[categories.length - 1];
      if (newlyAddedCategory && newlyAddedCategory.id !== selectedCategoryId) {
        setSelectedCategoryId(newlyAddedCategory.id);
      }
    }
  }, [categories, categoriesLoading]); // Depend on categories and loading state

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setNotes(product.notes || '');
      setLink(product.link || '');
      setPrice(product.price.toString());
      setCost(product.cost.toString());
      setStockQuantity(product.stock_quantity?.toString() || '0');
      setSelectedCategoryId(product.category_id || '');
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
      setStockQuantity('0');
      setSelectedCategoryId('');
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

  const handleAddNewCategory = () => {
    setOpenNewCategoryDialog(true);
  };

  const handleSaveNewCategory = () => {
    if (newCategoryName.trim() !== '') {
      dispatch(addCategoryCommand(newCategoryName));
      setNewCategoryName('');
      setOpenNewCategoryDialog(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    let imageUrl: string | undefined = imageUrlPreview || undefined;

    try {
      let currentProductId = product?.id;

      if (imageFile) {
        const imageFileName = currentProductId || crypto.randomUUID();
        imageUrl = await productService.uploadProductImage(imageFile, imageFileName);
      }

      const productData = {
        name,
        description,
        notes,
        link,
        price: parseFloat(price),
        cost: parseFloat(cost),
        stock_quantity: parseInt(stockQuantity),
        image_url: imageUrl,
        category_id: selectedCategoryId === '' ? null : selectedCategoryId, // Pass selected category ID
      };

      if (product) {
        dispatch(updateProductCommand({ ...product, ...productData }));
      } else {
        dispatch(addProductCommand(productData));
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
      console.error('Error during product submission:', err);
    } finally {
      setLoading(false);
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
        <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategoryId}
            label="Category"
            onChange={(e) => setSelectedCategoryId(e.target.value as string)}
          >
            <MenuItem value="">Unknown Category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
            <MenuItem value="add-new-category" onClick={handleAddNewCategory}>
              Add New Category
            </MenuItem>
          </Select>
        </FormControl>
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
        <TextField
          label="Stock Quantity"
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          fullWidth
          required
          InputProps={{
            inputProps: { min: 0 },
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

      <Dialog open={openNewCategoryDialog} onClose={() => setOpenNewCategoryDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewCategoryDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNewCategory} disabled={categoriesLoading}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductForm;
