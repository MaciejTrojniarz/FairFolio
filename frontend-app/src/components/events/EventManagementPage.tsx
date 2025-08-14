import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import EventList from './EventList';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';

const EventManagementPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleAddNewEvent = () => {
    navigate('/events/new');
  };

  

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('event_management_title')}
        </Typography>

        <Button variant="contained" onClick={handleAddNewEvent} sx={{ mb: 2 }}>
          {t('add_new_event_button')}
        </Button>

        <EventList />
      </Box>
    </Container>
  );
};

export default EventManagementPage;