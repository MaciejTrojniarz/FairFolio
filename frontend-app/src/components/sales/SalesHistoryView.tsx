import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchSalesCommand } from '../../store/features/sales/salesSlice';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import { fetchCostsCommand } from '../../store/features/costs/costsSlice';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  Paper,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar, Badge,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useI18n } from '../../contexts/useI18n';
import type { DetailedSaleItem, SaleWithSaleItems } from '../../types';
import { arrayToCsv, downloadCsv } from '../../utils/csv';

const SalesHistoryView: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useI18n();
  const navigate = useNavigate();
  const { salesHistory, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events);
  const { costs, loading: costsLoading, error: costsError } = useSelector((state: RootState) => state.costs);

  useEffect(() => {
    dispatch(fetchSalesCommand());
    dispatch(fetchEventsCommand());
    dispatch(fetchCostsCommand());
  }, [dispatch]);

  const handleSaleClick = (saleId: string) => {
    navigate(`/sales/${saleId}`);
  };

  const handleAddSaleToEvent = (eventId: string) => {
    navigate('/sales/record', { state: { eventId } });
  };

  const groupedSales = salesHistory.reduce((acc, sale) => {
    const eventId = sale.event_id || 'no-event';
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(sale);
    return acc;
  }, {} as Record<string, (SaleWithSaleItems)[]>);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('sales_history_title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => {
              // Flat export of all sales with items exploded into rows
              const headers = [
                'sale_id', 'timestamp', 'event_id', 'event_name', 'item_product_id', 'item_product_name', 'item_quantity', 'item_price_at_sale', 'sale_total_amount', 'sale_comment'
              ];
              const rows: (string | number)[][] = [];
              Object.values(groupedSales).forEach((sales) => {
                sales.forEach((sale) => {
                  const event = events.find(e => e.id === sale.event_id);
                  if (!sale.items || sale.items.length === 0) {
                    rows.push([
                      sale.id,
                      sale.timestamp,
                      sale.event_id || '',
                      event?.name || '',
                      '', '', '', '',
                      sale.total_amount,
                      sale.comment || '',
                    ]);
                  } else {
                    sale.items.forEach((item) => {
                      rows.push([
                        sale.id,
                        sale.timestamp,
                        sale.event_id || '',
                        event?.name || '',
                        item.product_id,
                        item.product_name,
                        item.quantity,
                        item.price_at_sale,
                        sale.total_amount,
                        sale.comment || '',
                      ]);
                    });
                  }
                });
              });
              const csv = arrayToCsv(headers, rows);
              const filename = `sales_${new Date().toISOString().slice(0,10)}.csv`;
              downloadCsv(filename, csv);
            }}
          >
            {t('export_csv_button')}
          </Button>
        </Box>

        {(salesLoading || eventsLoading || costsLoading) && <CircularProgress />}
        {(salesError || eventsError || costsError) && <Alert severity="error">Error: {salesError || eventsError || costsError}</Alert>}

        <List>
          {Object.keys(groupedSales).length === 0 && !salesLoading && !eventsLoading && !costsLoading && (
            <Typography variant="body1">{t('no_sales_recorded_yet')}</Typography>
          )}
          {Object.keys(groupedSales).sort((a, b) => {
            const eventA = events.find(e => e.id === a);
            const eventB = events.find(e => e.id === b);
            if (eventA && !eventB) return -1;
            if (!eventA && eventB) return 1;
            return a.localeCompare(b);
          }).map((eventId) => {
            const event = events.find(e => e.id === eventId);
            const eventDisplayName = event ? event.name : t('sales_without_event_group');
            const eventDetails = event ? ` (${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}${event.city ? `, ${event.city}` : ''})` : '';

            const salesInGroup = groupedSales[eventId];
            const totalSalesAmount = salesInGroup.reduce((sum, sale) => sum + sale.total_amount, 0);
            const totalCosts = costs.filter(cost => cost.event_id === eventId).reduce((sum, cost) => sum + cost.amount, 0);
            const netProfit = totalSalesAmount - totalCosts;

            return (
              <Accordion key={eventId} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', pr: 2 }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6">
                        {eventDisplayName}
                        {eventDetails && (
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {eventDetails}
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('total_sales_label')}: ${totalSalesAmount.toFixed(2)} | {t('total_costs_label')}: ${totalCosts.toFixed(2)} | {t('net_profit_label')}: ${netProfit.toFixed(2)}
                      </Typography>
                    </Box>
                    {event && eventId !== 'no-event' && (
                      <> {/* Use Fragment to group buttons */}
                        <Box // Replaced IconButton with Box
                          component="span" // Render as span to avoid button nesting
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${eventId}`);
                          }}
                          sx={{
                            ml: 2,
                            flexShrink: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                          aria-label={t('view_details_for', { eventDisplayName: eventDisplayName })}
                          title={t('view_details_for', { eventDisplayName: eventDisplayName })}>
                          <LaunchIcon fontSize="small" />
                        </Box>
                        <Box // Replaced Button with Box
                          component="span" // Render as span to avoid button nesting
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSaleToEvent(eventId);
                          }}
                          sx={{
                            ml: 1,
                            flexShrink: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                          aria-label={t('add_sale_aria_label')}
                          title={t('add_sale_tooltip')}>
                          <AddShoppingCartIcon fontSize="small" />
                        </Box>
                      </>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Remove the button from here */}
                  <List>
                    {salesInGroup.map((sale) => (
                      <Paper key={sale.id} elevation={1} sx={{ mb: 1 }}>
                        <ListItemButton onClick={() => handleSaleClick(sale.id)}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, py: 1 }}>
                            {sale.items.map((item: DetailedSaleItem) => (
                              <Badge key={item.id} badgeContent={item.quantity} color="primary">
                                <Avatar
                                  src={item.product_image_url || 'https://via.placeholder.com/50?text=N/A'}
                                  alt={item.product_name}
                                  variant="square"
                                  sx={{ width: 40, height: 40 }}
                                />
                              </Badge>
                            ))}
                            <Typography variant="body1" sx={{ ml: 2, fontWeight: 'bold' }}>
                              Total: ${sale.total_amount.toFixed(2)}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      </Paper>
                    ))
                  }
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </List>
      </Box>
    </Container>
  );
};

export default SalesHistoryView;
