import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // New imports
import type { RootState } from './store'; // New import
import { fetchMerchantCommand } from './store/features/merchant/merchantSlice'; // New import
import ProductManagementList from './components/products/ProductManagementList';
import ProductFormPage from './components/products/ProductFormPage';
import Home from './components/Home';
import SalesView from './components/SalesView';
import SalesHistoryView from './components/SalesHistoryView';
import SaleDetailView from './components/SaleDetailView';
import SaleEditPage from './components/SaleEditPage'; // New import
import EventManagementPage from './components/events/EventManagementPage'; // New import
import EventFormPage from './components/events/EventFormPage'; // New import
import EventDetailView from './components/EventDetailView'; // New import
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import ToastNotification from './components/ToastNotification'; // New import

function App() {
  const dispatch = useDispatch();
  const merchant = useSelector((state: RootState) => state.merchant.merchant);

  useEffect(() => {
    dispatch(fetchMerchantCommand()); // Fetch merchant data on mount
  }, [dispatch]);

  useEffect(() => {
    if (merchant?.name) {
      document.title = `FaireFolio - ${merchant.name}`;
    } else {
      document.title = `FaireFolio`; // Default title if merchant name not available
    }
  }, [merchant]);

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Main container for full height */}
        <Navbar /> {/* Render Navbar outside Routes */}
        <Box sx={{ flexGrow: 1, mt: 2 }}> {/* Content area, grows to fill remaining space */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductManagementList />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/sales/record" element={<SalesView />} /> {/* New path for recording sales */}
            <Route path="/sales" element={<SalesHistoryView />} /> {/* Sales history is now just /sales */}
            <Route path="/sales/:id" element={<SaleDetailView />} /> {/* Sale detail is now /sales/:id */}
            <Route path="/sales/:id/edit" element={<SaleEditPage />} /> {/* Sale edit is now /sales/:id/edit */}
            <Route path="/events" element={<EventManagementPage />} />
            <Route path="/events/new" element={<EventFormPage />} />
            <Route path="/events/:id" element={<EventDetailView />} /> {/* New read-only view */}
            <Route path="/events/:id/edit" element={<EventFormPage />} /> {/* Changed edit path */}
          </Routes>
        </Box>
      </Box>
      <ToastNotification /> {/* Render ToastNotification globally */}
    </BrowserRouter>
  );
}

export default App;