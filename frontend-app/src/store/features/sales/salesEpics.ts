import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators'; // Added mergeMap
import { saleService } from '../../../services/saleService';
import { showToast } from '../ui/uiSlice'; // New import
import {
  fetchSalesCommand,
  fetchSaleDetailsCommand,
  recordSaleCommand,
  updateSaleCommand,
  saleRecordedEvent,
  salesFetchedEvent,
  saleDetailsFetchedEvent,
  salesErrorEvent,
} from './salesSlice';
import type { RootState } from '../../index';
import type { Sale } from '../../../types';

export const fetchSalesEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchSalesCommand.type),
    switchMap(() =>
      from(saleService.fetchSales()).pipe(
        map((sales: Sale[]) => {
          console.log('Sales fetched by epic:', sales); // ADDED LOG
          return salesFetchedEvent(sales);
        }),
        catchError((error) => {
          console.error('Error fetching sales in epic:', error); // ADDED LOG
          return of(salesErrorEvent(error.message));
        })
      )
    )
  );

export const fetchSaleDetailsEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchSaleDetailsCommand.type),
    switchMap((action: ReturnType<typeof fetchSaleDetailsCommand>) =>
      from(saleService.fetchSaleDetails(action.payload)).pipe(
        map((data) => saleDetailsFetchedEvent(data)),
        catchError((error) => of(salesErrorEvent(error.message)))
      )
    )
  );

export const recordSaleEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(recordSaleCommand.type),
    withLatestFrom(state$),
    switchMap(([action, state]: [PayloadAction<string | undefined>, RootState]) => { // Modified action type
      const { basket, totalAmount } = state.sales;
      const eventId = action.payload; // Get eventId from action payload

      const saleData = {
        total_amount: totalAmount,
        event_id: eventId, // Pass event_id
      };

      const saleItemsData = basket.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_sale: item.price,
      }));

      return from(saleService.addSale(saleData, saleItemsData)).pipe(
        mergeMap((sale) => of(
          saleRecordedEvent(sale),
          showToast({ message: 'Sale recorded successfully!', severity: 'success' })
        )),
        catchError((error) => of(
          salesErrorEvent(error.message),
          showToast({ message: `Error recording sale: ${error.message}`, severity: 'error' })
        ))
      );
    })
  );

export const updateSaleEpic = (action$: any) =>
  action$.pipe(
    ofType(updateSaleCommand.type),
    switchMap((action: ReturnType<typeof updateSaleCommand>) =>
      from(saleService.updateSale(
        action.payload.saleId,
        action.payload.updatedSaleData,
        action.payload.updatedSaleItems,
        action.payload.originalSaleItems
      )).pipe(
        mergeMap((sale) => of(
          saleRecordedEvent(sale), // Re-use saleRecordedEvent for simplicity
          showToast({ message: 'Sale updated successfully!', severity: 'success' })
        )),
        catchError((error) => of(
          salesErrorEvent(error.message),
          showToast({ message: `Error updating sale: ${error.message}`, severity: 'error' })
        ))
      )
    )
  );

export const salesEpics = [
  fetchSalesEpic,
  fetchSaleDetailsEpic,
  recordSaleEpic,
  updateSaleEpic, // Add new epic to the array
];