import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import EventList from './EventList';
import { useNavigate } from 'react-router-dom';

const EventManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddNewEvent = () => {
    navigate('/events/new');
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Management
        </Typography>

        <Button variant="contained" onClick={handleAddNewEvent} sx={{ mb: 2 }}>
          Add New Event
        </Button>

        <EventList />
      </Box>
    </Container>
  );
};

export default EventManagementPage;