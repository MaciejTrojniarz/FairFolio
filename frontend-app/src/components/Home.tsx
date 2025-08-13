import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Container } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import { useI18n } from '../contexts/I18nContext'; // NEW IMPORT

const Home: React.FC = () => {
  const { t } = useI18n(); // NEW: useI18n hook

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {/* Logo Image */}
        <Box
          component="img"
          src="/fair_merchant_logo2.png" // Path to the image in public folder
          alt={t('app_name')} // Alt text for accessibility
          sx={{ maxWidth: '200px', height: 'auto', mb: 1 }} // Adjust size as needed
        />
        {/* App Name */}
        <Typography variant="h4" component="h1" gutterBottom>
          {t('app_name')}
        </Typography>
        {/* Smaller Text */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t('welcome_message')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/products" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label={t('product_management')} size="large">
              <InventoryIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">{t('products')}</Typography>
          </Link>
          <Link to="/sales/record" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label={t('record_sale')} size="large">
              <PointOfSaleIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">{t('record_sale')}</Typography>
          </Link>
          <Link to="/sales" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label={t('sales_history')} size="large">
              <HistoryIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">{t('sales_history')}</Typography>
          </Link>
          <Link to="/events" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label={t('event_management')} size="large">
              <EventIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">{t('event_management')}</Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;