import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CardMedia,
} from '@mui/material';
import type { Product } from '../../types';
import { useI18n } from '../../contexts/useI18n';
import { generateSvgPlaceholder } from '../../utils/imageHelpers';

interface ProductDetailsViewProps {
  product: Product;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const { t } = useI18n();

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Product Image */}
        <Box sx={{ flexShrink: 0, width: { xs: '100%', md: '40%' } }}>
          {product.image_url ? (
            <CardMedia
              component="img"
              image={product.image_url}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          ) : (
            <CardMedia
              component="img"
              image={generateSvgPlaceholder(product.name)}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        {/* Product Details */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description || t('no_description_provided')} {/* Translated */}
          </Typography>

          {product.category_name && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>{t('category')}:</strong> {product.category_name}
            </Typography>
          )}

          <Typography variant="h6">{t('price')}: ${product.price.toFixed(2)}</Typography> {/* Translated */}
          <Typography variant="h6">{t('cost')}: ${product.cost.toFixed(2)}</Typography> {/* Translated */}
          {product.stock_quantity !== undefined && (
            <Typography variant="h6">{t('stock_quantity')}: {product.stock_quantity}</Typography>
          )}

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
