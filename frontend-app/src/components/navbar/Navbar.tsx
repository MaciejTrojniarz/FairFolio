import React from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import { useI18n } from '../../contexts/useI18n';
import { useTheme } from '@mui/material/styles';
import CustomBreadcrumbs from './CustomBreadcrumbs';
import UserMenu from '../auth/UserMenu.tsx';

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      color="inherit" // Inherit color to allow custom background
      sx={{
        backgroundColor: theme.palette.background.paper, // Always use paper background for consistency
      }}
    >
      <Toolbar>
        <RouterLink to="/">
          <Box
            component="img"
            src="/fair_merchant_logo.png" // Updated path to the new image
            alt={t('app_name')} // Alt text for accessibility
            sx={{ height: 40, mr: 1 }} // Adjust height and margin as needed
            data-testid="navbar-logo"
          />
        </RouterLink>
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <CustomBreadcrumbs />
        </Box>
        <RouterLink to="/products">
          <IconButton color="primary" aria-label={t('product_management')} data-testid="navbar-products">
            <InventoryIcon />
          </IconButton>
        </RouterLink>
        <RouterLink to="/sales">
          <IconButton color="primary" aria-label={t('sales_history')} data-testid="navbar-sales">
            <HistoryIcon />
          </IconButton>
        </RouterLink>
        <RouterLink to="/events">
          <IconButton color="primary" aria-label={t('event_management')} data-testid="navbar-events">
            <EventIcon />
          </IconButton>
        </RouterLink>
        {/* User Icon and Menu */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;