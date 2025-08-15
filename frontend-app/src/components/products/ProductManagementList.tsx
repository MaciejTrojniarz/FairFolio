import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { arrayToCsv, downloadCsv } from '../../utils/csv';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';

const ProductManagementList: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { products } = useSelector((state: RootState) => state.products);

  const handleAddNewProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/products/${productId}/edit`);
  };

  return (
    <Container maxWidth={false} data-testid="product-management">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('product_management_title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleAddNewProduct} data-testid="add-new-product">
            {t('add_new_product_button')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const headers = [
                'id', 'name', 'description', 'notes', 'link', 'price', 'cost', 'stock_quantity', 'category_id', 'category_name', 'image_url'
              ];
              const rows = products.map(p => [
                p.id,
                p.name,
                p.description || '',
                p.notes || '',
                p.link || '',
                p.price,
                p.cost,
                p.stock_quantity ?? '',
                p.category_id ?? '',
                p.category_name ?? '',
                p.image_url ?? ''
              ]);
              const csv = arrayToCsv(headers, rows);
              const filename = `products_${new Date().toISOString().slice(0,10)}.csv`;
              downloadCsv(filename, csv);
            }}
          >
            {t('export_csv_button')}
          </Button>
        </Box>

        <ProductList onEdit={(product) => handleEditProduct(product.id)} />
      </Box>
    </Container>
  );
};

export default ProductManagementList;
