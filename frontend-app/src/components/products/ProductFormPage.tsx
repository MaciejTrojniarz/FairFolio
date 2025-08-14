import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import type { Product } from '../../types';
import { Container, CircularProgress, Alert } from '@mui/material';
import { showToast } from '../../store/features/ui/uiSlice';
import { useI18n } from '../../contexts/useI18n';
import ProductForm from './ProductForm';

const ProductFormPage: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

  

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProductToEdit(foundProduct);
      } else if (!loading) {
        console.error(`Product with ID ${id} not found.`);
        dispatch(showToast({ message: t('error_loading_product_message'), severity: 'error' }));
        navigate('/products');
      }
    } else if (!id) {
      setProductToEdit(undefined);
    }
  }, [id, products, loading, navigate, dispatch, t]);

  const handleClose = () => {
    navigate('/products');
  };

  if (id && loading) {
    return <Container maxWidth="md"><CircularProgress /></Container>;
  }

  if (id && error) {
    return <Container maxWidth="md"><Alert severity="error">{t('error_loading_product_message')}: {error}</Alert></Container>;
  }

  if (id && !productToEdit && !loading) {
    return <Container maxWidth="md"><Alert severity="warning">{t('product_not_found')}</Alert></Container>;
  }

  return (
    <Container maxWidth="md">
      <ProductForm product={productToEdit} onClose={handleClose} />
    </Container>
  );
};

export default ProductFormPage;