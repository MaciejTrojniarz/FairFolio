import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';

const ProductManagementList: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleAddNewProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/products/${productId}/edit`);
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('product_management_title')}
        </Typography>

        <Button variant="contained" onClick={handleAddNewProduct} sx={{ mb: 2 }}>
          {t('add_new_product_button')}
        </Button>

        <ProductList onEdit={(product) => handleEditProduct(product.id)} />
      </Box>
    </Container>
  );
};

export default ProductManagementList;
