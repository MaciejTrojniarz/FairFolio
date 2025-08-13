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

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const products = useSelector((state: RootState) => state.products.products);
  const events = useSelector((state: RootState) => state.events.events);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

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
    <AppBar position="static">
      <Toolbar>
        <RouterLink to="/">
          <Typography variant="h6" component="div">
            FaireFolio
          </Typography>
        </RouterLink>
        <Box sx={{ flexGrow: 1 }}>
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
                displayValue = `Sale ${value.substring(0, 4)}...`; // Shorten ID for display
              } else if (pathnames[index - 2] === 'sales' && pathnames[index - 1] === 'edit' && index === pathnames.length - 1) { // Sales edit
                const saleId = value;
                // Similar to product, getting sale name here is hard without fetching
                displayValue = 'Edit Sale'; // Simplified for debugging
              } else if (pathnames[index - 1] === 'new') { // For 'new' pages
                displayValue = `New ${pathnames[index - 2].charAt(0).toUpperCase() + pathnames[index - 2].slice(1)}`;
              } else if (value === 'record' && pathnames[index - 1] === 'sales') {
                displayValue = 'Record Sale';
              } else if (value === 'sales' && index === 0) { // For the top-level /sales
                displayValue = 'Sales History';
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
                  displayValue = `Edit ${event.name}`;
                } else {
                  displayValue = `Edit Event ${eventId.substring(0, 4)}...`;
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
            })
          }
          </Breadcrumbs>
        </Box>
        <RouterLink to="/product">
          <IconButton color="inherit" aria-label="product management">
            <InventoryIcon />
          </IconButton>
        </RouterLink>
        <RouterLink to="/sales">
          <IconButton color="inherit" aria-label="sales history">
            <HistoryIcon />
          </IconButton>
        </RouterLink>
        <RouterLink to="/events">
          <IconButton color="inherit" aria-label="event management">
            <EventIcon />
          </IconButton>
        </RouterLink>
        {/* User Icon and Menu */}
        <Box sx={{ flexGrow: 0 }}>
          {user ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <GravatarAvatar email={user?.email} size={40} /> {/* Use GravatarAvatar */}
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
                  <SettingsIcon sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;