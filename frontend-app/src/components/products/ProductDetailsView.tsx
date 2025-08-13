import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CardMedia,
} from '@mui/material';
import type { Product } from '../../types';
import { useI18n } from '../../contexts/I18nContext'; // NEW IMPORT

interface ProductDetailsViewProps {
  product: Product;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const { t } = useI18n(); // NEW: useI18n hook

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Product Image */}
        <Box sx={{ flexShrink: 0, width: { xs: '100%', md: '40%' } }}>
          <CardMedia
            component="img"
            image={product.image_url || 'https://via.placeholder.com/400?text=No+Image'}
            alt={product.name}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        </Box>

        {/* Product Details */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description || t('no_description_provided')} {/* Translated */}
          </Typography>

          <Typography variant="h6">{t('price')}: ${product.price.toFixed(2)}</Typography> {/* Translated */}
          <Typography variant="h6">{t('cost')}: ${product.cost.toFixed(2)}</Typography> {/* Translated */}

          {product.notes && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>{t('notes')}:</strong> {product.notes}
            </Typography>
          )}

          {product.link && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>{t('link')}:</strong> <a href={product.link} target="_blank" rel="noopener noreferrer">{product.link}</a>
            </Typography>
          )}

          {/* Add more details as needed */}
          {/* Example: Category if available */}
          {/* {product.category_id && (
            <Typography variant="body2" color="text.secondary">
              Category ID: {product.category_id}
            </Typography>
          )} */}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductDetailsView;
