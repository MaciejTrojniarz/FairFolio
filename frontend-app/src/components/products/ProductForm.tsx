import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '../../types';
import {
  addProductCommand,
  updateProductCommand,
} from '../../store/features/products/productsSlice';
import { productService } from '../../services/productService';
import { showToast } from '../../store/features/ui/uiSlice';

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
  CircularProgress,
  Alert,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useI18n } from '../../contexts/useI18n';
import type { RootState } from '../../store';

interface ProductFormProps {
  product?: Product; // Optional, for editing existing products
  onClose: () => void; // Callback to close form/dialog
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { t } = useI18n();
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

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && newCategoryName === '') {
      const newlyAddedCategory = categories[categories.length - 1];
      if (newlyAddedCategory && newlyAddedCategory.id !== selectedCategoryId) {
        setSelectedCategoryId(newlyAddedCategory.id);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, categoriesLoading]);

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
      setImageFile(null);
    } else {
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
      setImageUrlPreview(URL.createObjectURL(file));
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
      const currentProductId = product?.id;

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
        category_id: selectedCategoryId === '' ? null : selectedCategoryId,
      };

      if (product) {
        dispatch(updateProductCommand({ ...product, ...productData }));
      } else {
        dispatch(addProductCommand(productData));
      }
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
      console.error('Error during product submission:', error);
      dispatch(showToast({ message: error.message, severity: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {product ? t('edit_product_title') : t('add_new_product_title')}
      </Typography>
      {loading && <CircularProgress sx={{ my: 2 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label={t('product_name_label')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label={t('description_label')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label={t('notes_label')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label={t('link_label')}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
          <InputLabel id="category-select-label">{t('category_label')}</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategoryId}
            label={t('category_label')}
            onChange={(e) => setSelectedCategoryId(e.target.value as string)}
          >
            <MenuItem value="">{t('unknown_category_option')}</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
            <MenuItem value="add-new-category" onClick={handleAddNewCategory}>
              {t('add_new_category_option')}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={t('price_label')}
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
          label={t('cost_label')}
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
          label={t('stock_quantity_label')}
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
            {t('upload_image_button')}
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imageUrlPreview && (
            <Avatar src={imageUrlPreview} alt="Product Image" variant="square" sx={{ width: 56, height: 56 }} />
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary">
          {product ? t('update_product_button') : t('add_product_button')}
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          {t('cancel_button')}
        </Button>
      </Box>

      <Dialog open={openNewCategoryDialog} onClose={() => setOpenNewCategoryDialog(false)}>
        <DialogTitle>{t('add_new_category_dialog_title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('category_name_label')}
            type="text"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewCategoryDialog(false)}>{t('cancel_button')}</Button>
          <Button onClick={handleSaveNewCategory} disabled={categoriesLoading}>{t('add_button')}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductForm;
