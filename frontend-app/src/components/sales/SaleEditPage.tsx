import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchSaleDetailsCommand } from '../../store/features/sales/salesSlice';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useI18n } from '../../contexts/useI18n';
import SaleEditForm from './SaleEditForm';

const SaleEditPage: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedSale, selectedSaleItems, loading, error } = useSelector((state: RootState) => state.sales);

  useEffect(() => {
    if (id) {
      dispatch(fetchSaleDetailsCommand(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">Error: {error}</Alert>
          <Button variant="contained" onClick={() => navigate(`/sales/${id}`)} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_sale_details')}
          </Button>
        </Box>
      </Container>
    );
  }

  if (!selectedSale || selectedSale.id !== id) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">{t('sale_not_found_or_loading')}</Alert>
          <Button variant="contained" onClick={() => navigate(`/sales/${id}`)} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_sale_details')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <SaleEditForm sale={selectedSale} saleItems={selectedSaleItems} />
  );
};

export default SaleEditPage;