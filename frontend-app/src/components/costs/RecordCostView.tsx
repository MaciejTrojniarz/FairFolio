import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Container, Box, Typography, Paper, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EventSelector from '../events/EventSelector';
import { recordCostCommand } from '../../store/features/costs/costsSlice';
import { useI18n } from '../../contexts/useI18n';
import { addCostCategoryCommand, fetchCostCategoriesCommand } from '../../store/features/costCategories/costCategoriesSlice';

const RecordCostView: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.costs);
  const categories = useSelector((state: RootState) => state.costCategories.categories);
  const { loading: categoriesLoading } = useSelector((state: RootState) => state.costCategories);
  const { t } = useI18n();

  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [openNewCategoryDialog, setOpenNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    dispatch(fetchCostCategoriesCommand());
  }, [dispatch]);

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && newCategoryName === '') {
      const newlyAddedCategory = categories[categories.length - 1];
      if (newlyAddedCategory && newlyAddedCategory.id !== selectedCategoryId) {
        setSelectedCategoryId(newlyAddedCategory.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, categoriesLoading]);

  const canSubmit = name.trim().length > 0 && amount !== '' && !isNaN(Number(amount));

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch(recordCostCommand({
      eventId: selectedEventId,
      name: name.trim(),
      costCategoryId: selectedCategoryId || undefined,
      amount: Number(amount),
      date,
    }));
    setName('');
    setSelectedCategoryId('');
    setAmount('');
    setSelectedEventId(undefined);
    setDate(new Date().toISOString().slice(0,10));
  };

  const handleSaveNewCategory = (name: string) => {
    if (name.trim() !== '') {
      dispatch(addCostCategoryCommand(name));
      setNewCategoryName('');
      setOpenNewCategoryDialog(false);
    }
  };

  return (
    <Container maxWidth="sm" data-testid="record-cost-view">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('record_cost_title')}
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">Error: {error}</Alert>}

        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <EventSelector
            selectedEventId={selectedEventId}
            onSelectEvent={(id) => setSelectedEventId(id)}
          />
          <TextField
            label={t('cost_name_label')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ 'data-testid': 'cost-name' }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="cost-category-select-label">{t('category_label')}</InputLabel>
            <Select
              labelId="cost-category-select-label"
              value={selectedCategoryId}
              label={t('category_label')}
              onChange={(e) => setSelectedCategoryId(e.target.value as string)}
              data-testid="cost-category-select"
            >
              <MenuItem value="">{t('unknown_category_option')}</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
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
            inputProps={{ 'data-testid': 'cost-date' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
            disabled={!canSubmit || loading}
            data-testid="record-cost"
          >
            {t('record_cost_button')}
          </Button>
        </Paper>
      </Box>
      <NewCategoryDialog
        open={openNewCategoryDialog}
        onClose={() => setOpenNewCategoryDialog(false)}
        onSave={handleSaveNewCategory}
        loading={categoriesLoading}
        t={t}
        value={newCategoryName}
        onChange={setNewCategoryName}
      />
    </Container>
  );
};

// New Category Dialog
const NewCategoryDialog: React.FC<{ open: boolean; onClose: () => void; onSave: (name: string) => void; loading: boolean; t: (k: string) => string; value: string; onChange: (v: string) => void; }>=({ open, onClose, onSave, loading, t, value, onChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{t('add_new_category_dialog_title')}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label={t('category_name_label')}
        type="text"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{t('cancel_button')}</Button>
      <Button onClick={() => onSave(value)} disabled={loading}>{t('add_button')}</Button>
    </DialogActions>
  </Dialog>
);

export default RecordCostView;
