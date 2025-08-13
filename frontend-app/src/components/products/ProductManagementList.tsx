import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';

const ProductManagementList: React.FC = () => {
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
          Product Management
        </Typography>

        <Button variant="contained" onClick={handleAddNewProduct} sx={{ mb: 2 }}>
          Add New Product
        </Button>

        <ProductList onEdit={(product) => handleEditProduct(product.id)} />
      </Box>
    </Container>
  );
};

export default ProductManagementList;
