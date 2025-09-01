import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Container, Box, Typography, Paper, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EventSelector from '../events/EventSelector';
import { useI18n } from '../../contexts/useI18n';
import { fetchCostCategoriesCommand, addCostCategoryCommand } from '../../store/features/costCategories/costCategoriesSlice';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import { costService } from '../../services/costService';
import { showToast } from '../../store/features/ui/uiSlice';

const EditCostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const categories = useSelector((state: RootState) => state.costCategories.categories);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  // New category dialog state
  const categoriesLoading = useSelector((state: RootState) => state.costCategories.loading);
  const [openNewCategoryDialog, setOpenNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    dispatch(fetchCostCategoriesCommand());
    dispatch(fetchEventsCommand());
    if (id) {
      costService.fetchCostById(id)
        .then((cost) => {
          setName(cost.name);
          setSelectedEventId(cost.event?.id || undefined);
          setSelectedCategoryId(cost.cost_category_id || '');
          setAmount(cost.amount.toString());
          setDate(cost.date);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, dispatch]);

  const handleSaveNewCategory = (name: string) => {
    if (name.trim()) {
      dispatch(addCostCategoryCommand(name));
      setNewCategoryName('');
      setOpenNewCategoryDialog(false);
    }
  };

  const canSubmit = name.trim().length > 0 && amount !== '' && !isNaN(Number(amount));

  const handleSubmit = () => {
    if (!id || !canSubmit) return;
    setLoading(true);
    costService.updateCost(id, {
      name: name.trim(),
      event_id: selectedEventId ?? null,
      cost_category_id: selectedCategoryId || null,
      amount: Number(amount),
      date,
    })
    .then(() => {
      dispatch(showToast({ message: t('cost_updated_success'), severity: 'success' }));
      navigate('/costs');
    })
    .catch((err) => {
      setError(err.message);
      dispatch(showToast({ message: `${t('error_updating_cost')}: ${err.message}`, severity: 'error' }));
    })
    .finally(() => setLoading(false));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('edit_cost_title')}
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <EventSelector
          selectedEventId={selectedEventId}
          onSelectEvent={(ev) => setSelectedEventId(ev)}
        />
        <TextField
          label={t('cost_name_label')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="cost-category-select-label">{t('category_label')}</InputLabel>
          <Select
            labelId="cost-category-select-label"
            value={selectedCategoryId}
            label={t('category_label')}
            onChange={(e) => setSelectedCategoryId(e.target.value as string)}
          >
            <MenuItem value="">{t('unknown_category_option')}</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
            <MenuItem value="add-new-category" onClick={() => setOpenNewCategoryDialog(true)}>
              {t('add_new_category_option')}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={t('amount_label')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          inputProps={{ step: '0.01', min: '0' }}
        />
        <TextField
          label={t('date')}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
          disabled={!canSubmit || loading}
        >
          {t('update_cost_button')}
        </Button>
      </Paper>
      {/* New Category Dialog */}
      <Dialog open={openNewCategoryDialog} onClose={() => setOpenNewCategoryDialog(false)}>
        <DialogTitle>{t('add_new_category_dialog_title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('category_name_label')}
            type="text"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewCategoryDialog(false)}>{t('cancel_button')}</Button>
          <Button onClick={() => handleSaveNewCategory(newCategoryName)} disabled={categoriesLoading}>{t('add_button')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditCostView;
