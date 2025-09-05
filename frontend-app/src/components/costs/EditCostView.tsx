import React from 'react';
import { Container, Box, Typography, Paper, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EventSelector from '../events/EventSelector';
import { useI18n } from '../../contexts/useI18n';
import { useEditCostForm } from './useEditCostForm';

const EditCostView: React.FC = () => {
  const { t } = useI18n();
  const {
    loading,
    error,
    name,
    setName,
    eventId,
    setEventId,
    categoryId,
    setCategoryId,
    amount,
    setAmount,
    date,
    setDate,
    openDialog,
    setOpenDialog,
    newCategoryName,
    setNewCategoryName,
    handleSaveCategory,
    canSubmit,
    handleSubmit,
    categories,
    categoriesLoading,
  } = useEditCostForm();

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
          selectedEventId={eventId}
          onSelectEvent={(ev) => setEventId(ev)}
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
            value={categoryId}
            label={t('category_label')}
            onChange={(e) => setCategoryId(e.target.value as string)}
          >
            <MenuItem value="">{t('unknown_category_option')}</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
            <MenuItem value="add-new-category" onClick={() => setOpenDialog(true)}>
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
          disabled={!canSubmit}
        >
          {t('update_cost_button')}
        </Button>
      </Paper>
      {/* New Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
          <Button onClick={() => setOpenDialog(false)}>{t('cancel_button')}</Button>
          <Button onClick={() => handleSaveCategory(newCategoryName)} disabled={categoriesLoading}>{t('add_button')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditCostView;
