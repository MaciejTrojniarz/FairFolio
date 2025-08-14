import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchProductsCommand, deleteProductCommand } from '../../store/features/products/productsSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductDetailsView from './ProductDetailsView';
import { useI18n } from '../../contexts/useI18n';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const product = products.find(p => p.id === id);

  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);

  const { t } = useI18n();

  useEffect(() => {
    if (products.length === 0 || !product) {
      dispatch(fetchProductsCommand());
    }
  }, [products, product, dispatch]);

  const handleDeleteClick = () => {
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (product) {
      dispatch(deleteProductCommand(product.id));
      setOpenConfirmDelete(false);
      navigate('/products');
    }
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">Error: {error}</Alert>
          <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_products')}
          </Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">{t('product_not_found')}</Alert>
          <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_products')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/products')}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_products')}
          </Button>
          <Box>
            <Button variant="contained" onClick={() => navigate(`/products/${product.id}/edit`)} sx={{ mr: 1 }}>
              <EditIcon sx={{ mr: 1 }} /> {t('edit_product')}
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              <DeleteIcon sx={{ mr: 1 }} /> {t('delete')}
            </Button>
          </Box>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('product_details')}
        </Typography>

        <ProductDetailsView product={product} />
      </Box>

      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('confirm_deletion')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('are_you_sure_delete_product', { productName: product.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>{t('cancel')}</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetailsPage;