import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { arrayToCsv, downloadCsv } from '../../utils/csv';
import EventList from './EventList';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';

const EventManagementPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { events } = useSelector((state: RootState) => state.events);

  const handleAddNewEvent = () => {
    navigate('/events/new');
  };

  

  return (
    <Container maxWidth="lg" data-testid="event-management">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('event_management_title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleAddNewEvent} data-testid="add-new-event">
            {t('add_new_event_button')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const headers = ['id','name','description','link','start_date','end_date','venue','city'];
              const rows = events.map(e => [
                e.id,
                e.name,
                e.description || '',
                e.link || '',
                e.start_date,
                e.end_date,
                e.venue,
                e.city,
              ]);
              const csv = arrayToCsv(headers, rows);
              const filename = `events_${new Date().toISOString().slice(0,10)}.csv`;
              downloadCsv(filename, csv);
            }}
          >
            {t('export_csv_button')}
          </Button>
        </Box>

        <EventList />
      </Box>
    </Container>
  );
};

export default EventManagementPage;