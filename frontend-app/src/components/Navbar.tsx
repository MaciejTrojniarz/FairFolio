import React from 'react';
import { AppBar, Toolbar, Typography, Button, Breadcrumbs, Link as MuiLink, Box, IconButton } from '@mui/material'; // Added IconButton
import { Link as RouterLink, useLocation } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History'; // New import
import EventIcon from '@mui/icons-material/Event'; // New import
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Navbar: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const products = useSelector((state: RootState) => state.products.products);
  const events = useSelector((state: RootState) => state.events.events); // Get events from Redux store

  return (
    <AppBar position="static">
      <Toolbar>
        <RouterLink to="/"><Typography variant="h6" component="div">
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
              } else if (value === 'record' && pathnames[index - 1] === 'sales') { // For /sales/record
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;