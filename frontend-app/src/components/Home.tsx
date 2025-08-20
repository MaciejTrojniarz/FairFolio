import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { fetchEventsCommand } from '../store/features/events/eventsSlice';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Container, List, ListItem, ListItemText, Paper, Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useI18n } from '../contexts/useI18n';
import cartLogo from '/fair_merchant_logo2.png?url'

const Home: React.FC = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const isAuthenticated = useSelector((state: RootState) => Boolean(state.auth.user));

  useEffect(() => {
    if (isAuthenticated && events.length === 0) {
      dispatch(fetchEventsCommand());
    }
  }, [dispatch, isAuthenticated, events.length]);

  const upcomingEvents = events.filter(event => new Date(event.end_date) >= new Date());

  return (
    <Container maxWidth={false}>
          <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              backgroundImage:`url(${cartLogo})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              height: "50vh",
              width: '100%'
            }}/>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {t('welcome_message')}
            </Typography>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/products" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <IconButton color="primary" aria-label={t('product_management')} size="large">
                    <InventoryIcon sx={{ fontSize: 80 }} />
                  </IconButton>
                  <Typography variant="subtitle1" color="text.primary">{t('products')}</Typography>
                </Link>
                <Link to="/sales/record" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <IconButton color="primary" aria-label={t('record_sale')} size="large">
                    <PointOfSaleIcon sx={{ fontSize: 80 }} />
                  </IconButton>
                  <Typography variant="subtitle1" color="text.primary">{t('record_sale')}</Typography>
                </Link>
                <Link to="/sales" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <IconButton color="primary" aria-label={t('sales_history')} size="large">
                    <HistoryIcon sx={{ fontSize: 80 }} />
                  </IconButton>
                  <Typography variant="subtitle1" color="text.primary">{t('sales_history')}</Typography>
                </Link>
                <Link to="/events" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <IconButton color="primary" aria-label={t('event_management')} size="large">
                    <EventIcon sx={{ fontSize: 80 }} />
                  </IconButton>
                  <Typography variant="subtitle1" color="text.primary">{t('event_management')}</Typography>
                </Link>
                <Link to="/costs/record" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <IconButton color="primary" aria-label={t('record_cost')} size="large">
                    <AttachMoneyIcon sx={{ fontSize: 80 }} />
                  </IconButton>
                  <Typography variant="subtitle1" color="text.primary">{t('record_cost')}</Typography>
                </Link>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                <Button component={Link} to="/login" variant="contained" color="primary">
                  {t('login')}
                </Button>
                <Button component={Link} to="/login" variant="outlined" color="primary">
                  {t('register')}
                </Button>
              </Box>
            )}
            {isAuthenticated && (
              <Box sx={{ width: '100%', maxWidth: 600, mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom textAlign="center">
                  {t('upcoming_events')}
                </Typography>
                {loading ? (
                  <Typography textAlign="center">{t('loading_events')}</Typography>
                ) : error ? (
                  <Typography color="error" textAlign="center">Error: {error}</Typography>
                ) : upcomingEvents.length === 0 ? (
                  <Typography textAlign="center">{t('no_upcoming_events')}</Typography>
                ) : (
                  <List>
                    {upcomingEvents.map((event) => (
                      <Paper key={event.id} elevation={1} sx={{ mb: 1 }}>
                        <ListItem component={Link} to={`/events/${event.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                          <ListItemText
                            primary={event.name}
                            secondary={`
                              ${event.venue ? `${event.venue}, ` : ''}
                              ${event.city ? `${event.city} - ` : ''}
                              ${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}
                            `}
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Box>
    </Container>
  );
};

export default Home;