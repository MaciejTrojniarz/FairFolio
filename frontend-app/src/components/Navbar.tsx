import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Breadcrumbs, Link as MuiLink, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings'; // NEW IMPORT
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { supabase } from '../supabaseClient';
import GravatarAvatar from './common/GravatarAvatar'; // NEW IMPORT
import { useI18n } from '../contexts/I18nContext'; // NEW IMPORT 
import { useThemeMode } from '../contexts/ThemeContext'; // NEW IMPORT
import { useTheme } from '@mui/material/styles'; // NEW IMPORT

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const products = useSelector((state: RootState) => state.products.products);
  const events = useSelector((state: RootState) => state.events.events);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n(); // NEW: useI18n hook
  const { mode } = useThemeMode(); // NEW: useThemeMode hook
  const theme = useTheme(); // NEW: useTheme hook

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
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
          />
        </RouterLink>
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Breadcrumbs aria-label="breadcrumb" color="inherit">
            {pathnames.map((value, index) => {
              // Skip 'edit' segment in breadcrumbs for both products and sales
              if (value === 'edit' && (pathnames[index - 1] === 'product' || pathnames[index - 1] === 'sales')) {
                return null;
              }

              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              let displayValue = value.charAt(0).toUpperCase() + value.slice(1);

              // Handle dynamic names for product and sales details/edit
              if (pathnames[index - 1] === 'product' && index === pathnames.length - 1) { // Product detail
                const productId = value;
                const product = products.find(p => p.id === productId);
                if (product) {
                  displayValue = product.name;
                }
              } else if (pathnames[index - 1] === 'sales' && index === pathnames.length - 1) { // Sales detail
                displayValue = `${t('sale')} ${value.substring(0, 4)}...`; // Translated
              } else if (pathnames[index - 2] === 'sales' && pathnames[index - 1] === 'edit' && index === pathnames.length - 1) { // Sales edit
                const saleId = value;
                displayValue = t('edit_sale'); // Translated
              } else if (pathnames[index - 1] === 'new') { // For 'new' pages
                displayValue = `${t('new')} ${pathnames[index - 2].charAt(0).toUpperCase() + pathnames[index - 2].slice(1)}`; // Translated
              } else if (value === 'record' && pathnames[index - 1] === 'sales') {
                displayValue = t('record_sale'); // Translated
              } else if (value === 'sales' && index === 0) { // For the top-level /sales
                displayValue = t('sales_history'); // Translated
              } else if (pathnames[index - 1] === 'events' && index === pathnames.length - 1) { // Event detail
                const eventId = value;
                const event = events.find(e => e.id === eventId);
                if (event) {
                  displayValue = event.name;
                }
              } else if (pathnames[index - 2] === 'events' && pathnames[index - 1] === 'edit' && index === pathnames.length - 1) { // Event edit
                const eventId = value;
                const event = events.find(e => e.id === eventId);
                if (event) {
                  displayValue = `${t('edit_event')} ${event.name}`; // Translated
                } else {
                  displayValue = `${t('edit_event')} ${eventId.substring(0, 4)}...`; // Translated
                }
              }
              return last ? (
                <Typography color="text.primary" key={to}>
                  {displayValue}
                </Typography>
              ) : (
                <MuiLink component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
                  {displayValue}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        </Box>
        <RouterLink to="/product">
          <IconButton color="primary" aria-label={t('product_management')}>
            <InventoryIcon />
          </IconButton>
        </RouterLink>
        <RouterLink to="/sales">
          <IconButton color="primary" aria-label={t('sales_history')}>
            <HistoryIcon />
          </IconButton>
        </RouterLink>
        <RouterLink to="/events">
          <IconButton color="primary" aria-label={t('event_management')}>
            <EventIcon />
          </IconButton>
        </RouterLink>
        {/* User Icon and Menu */}
        <Box sx={{ flexGrow: 0 }}>
          {user ? (
            <>
              <IconButton
                size="large"
                aria-label={t('user_profile')}
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <GravatarAvatar email={user?.email} size={40} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                  <SettingsIcon sx={{ mr: 1 }} /> {t('profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  {t('logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              {t('login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;