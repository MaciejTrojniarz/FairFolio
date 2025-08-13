import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchProductsCommand } from '../../store/features/products/productsSlice';
import type { Product } from '../../types';
import { Container, CircularProgress, Alert } from '@mui/material';
import ProductForm from './ProductForm';

const ProductFormPage: React.FC = () => {
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
        // If product not found and not loading, navigate back or show error
        console.error(`Product with ID ${id} not found.`);
        navigate('/products'); // Navigate back to list if not found
      }
    } else if (!id) {
      // For new product creation, ensure no product is set for editing
      setProductToEdit(undefined);
    }
  }, [id, products, loading, navigate]);

  const handleClose = () => {
    navigate('/products'); // Navigate back to product list after form submission/cancellation
  };

  if (id && loading) {
    return <Container maxWidth="md"><CircularProgress /></Container>;
  }

  if (id && error) {
    return <Container maxWidth="md"><Alert severity="error">Error loading product: {error}</Alert></Container>;
  }

  if (id && !productToEdit && !loading) {
    // This case handles when a product ID is in the URL but the product isn't found after loading
    return <Container maxWidth="md"><Alert severity="warning">Product not found.</Alert></Container>;
  }

  return (
    <Container maxWidth="md">
      <ProductForm product={productToEdit} onClose={handleClose} />
    </Container>
  );
};

export default ProductFormPage;