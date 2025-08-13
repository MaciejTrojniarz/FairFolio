import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Container } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event'; // New import

const Home: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to FaireFolio
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Choose your action:
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/products" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label="product management" size="large">
              <InventoryIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">Products</Typography>
          </Link>
          <Link to="/sales/record" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label="record sale" size="large">
              <PointOfSaleIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">Record Sale</Typography>
          </Link>
          <Link to="/sales" style={{ textDecoration: 'none', textAlign: 'center' }}> {/* Changed to /sales */}
            <IconButton color="primary" aria-label="sales history" size="large">
              <HistoryIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">Sales History</Typography>
          </Link>
          <Link to="/events" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <IconButton color="primary" aria-label="event management" size="large">
              <EventIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">Events</Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;