import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Container, Box, Typography, Paper, TextField, Button, CircularProgress, Alert } from '@mui/material';
import EventSelector from '../events/EventSelector';
import { recordCostCommand } from '../../store/features/costs/costsSlice';
import { useI18n } from '../../contexts/useI18n';

const RecordCostView: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.costs);
  const { t } = useI18n();

  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));

  const canSubmit = name.trim().length > 0 && amount !== '' && !isNaN(Number(amount));

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch(recordCostCommand({
      eventId: selectedEventId,
      name: name.trim(),
      category: category.trim() || undefined,
      amount: Number(amount),
      date,
    }));
    setName('');
    setCategory('');
    setAmount('');
    setSelectedEventId(undefined);
    setDate(new Date().toISOString().slice(0,10));
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
          <TextField
            label={t('cost_category_label')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ 'data-testid': 'cost-category' }}
          />
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
    </Container>
  );
};

export default RecordCostView;
