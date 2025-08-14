import React from 'react';
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useI18n } from '../../contexts/useI18n';

const CustomBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const products = useSelector((state: RootState) => state.products.products);
  const events = useSelector((state: RootState) => state.events.events);
  const { t } = useI18n();

  return (
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
  );
};

export default CustomBreadcrumbs;