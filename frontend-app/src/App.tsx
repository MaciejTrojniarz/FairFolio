
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductManagementList from './components/products/ProductManagementList';
import ProductDetailsPage from './components/products/ProductDetailsPage';
import ProductFormPage from './components/products/ProductFormPage';
import Home from './components/Home';
import SalesView from './components/sales/SalesView';
import SalesHistoryView from './components/sales/SalesHistoryView';
import SaleDetailView from './components/sales/SaleDetailView';
import SaleEditPage from './components/sales/SaleEditPage';
import EventManagementPage from './components/events/EventManagementPage';
import EventFormPage from './components/events/EventFormPage';
import EventDetailView from './components/events/EventDetailView';
import Navbar from './components/navbar/Navbar';
import { Box } from '@mui/material';
import ToastNotification from './components/ToastNotification';

import Login from './components/auth/Login.tsx';
import Profile from './components/auth/Profile.tsx';
import ProfileEditPage from './components/auth/ProfileEditPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

import { I18nProvider } from './contexts/I18nContext';
import { AppThemeProvider } from './contexts/ThemeContext';
import AuthInitializer from './components/AuthInitializer';

const App = () => {
  return (
    <AppThemeProvider>
      <I18nProvider>
        <AuthInitializer>
          <BrowserRouter>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
              <Navbar />
              <Box sx={{ flexGrow: 1, mt: '64px', overflowY: 'auto', minHeight: 'calc(100vh - 64px)' }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<ProfileEditPage />} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/" element={<Home />} />
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/products" element={<ProductManagementList />} />
                    <Route path="/products/new" element={<ProductFormPage />} />
                    <Route path="/products/:id/edit" element={<ProductFormPage />} />
                    <Route path="/sales/record" element={<SalesView />} />
                    <Route path="/sales" element={<SalesHistoryView />} />
                    <Route path="/sales/:id" element={<SaleDetailView />} />
                    <Route path="/sales/:id/edit" element={<SaleEditPage />} />
                    <Route path="/events" element={<EventManagementPage />} />
                    <Route path="/events/new" element={<EventFormPage />} />
                    <Route path="/events/:id" element={<EventDetailView />} />
                    <Route path="/events/:id/edit" element={<EventFormPage />} />
                  </Route>
                </Routes>
              </Box>
            </Box>
            <ToastNotification />
          </BrowserRouter>
        </AuthInitializer>
      </I18nProvider>
    </AppThemeProvider>
  );
}

export default App;