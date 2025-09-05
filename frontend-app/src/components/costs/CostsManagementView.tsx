import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Container, Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { fetchCostsCommand } from '../../store/features/costs/costsSlice';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import { useI18n } from '../../contexts/useI18n';
import { useNavigate } from 'react-router-dom';

const CostsManagementView: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { costs, loading, error } = useSelector((state: RootState) => state.costs);
  const events = useSelector((state: RootState) => state.events.events);
  const [filterEventId, setFilterEventId] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(fetchCostsCommand());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchEventsCommand());
  }, [dispatch]);
  const displayedCosts = costs
    .filter((cost) =>
      filterEventId === 'all'
        ? true
        : filterEventId === 'unassigned'
        ? !cost.event
        : cost.event?.id === filterEventId
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">{t('costs_management')}</Typography>
      </Box>
      <Box mb={2} sx={{ display: 'flex', gap: 2 }}>
        <FormControl>
          <InputLabel id="filter-event-label">{t('filter_event')}</InputLabel>
          <Select
            labelId="filter-event-label"
            value={filterEventId}
            label={t('filter_event')}
            onChange={(e) => setFilterEventId(e.target.value)}
          >
            <MenuItem value="all">{t('all')}</MenuItem>
            <MenuItem value="unassigned">{t('unassigned')}</MenuItem>
            {events.map((evt) => (
              <MenuItem key={evt.id} value={evt.id}>{evt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={() => setSortAsc(!sortAsc)}>
          {t(sortAsc ? 'sort_asc' : 'sort_desc')}
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('date')}</TableCell>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('amount')}</TableCell>
                <TableCell>{t('event')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCosts.map((cost) => (
                <TableRow key={cost.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/costs/${cost.id}/edit`)}>
                  <TableCell>{cost.date}</TableCell>
                  <TableCell>{cost.name}</TableCell>
                  <TableCell>{cost.amount.toFixed(2)}</TableCell>
                  <TableCell>{cost.event?.name || t('unassigned')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CostsManagementView;
