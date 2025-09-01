import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { costService } from '../../../services/costService';
import {
  fetchCostsCommand,
  recordCostCommand,
  updateCostCommand,
  costsFetchedEvent,
  costRecordedEvent,
  costUpdatedEvent,
  costsErrorEvent,
} from './costsSlice';
import type { Cost } from '../../../types';
import { showToast } from '../ui/uiSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchCostsEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchCostsCommand.type),
    switchMap(() =>
      from(costService.fetchCosts()).pipe(
        map((costs: Cost[]) => costsFetchedEvent(costs)),
        catchError((error) => of(costsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const recordCostEpic = (action$: any) =>
  action$.pipe(
    ofType(recordCostCommand.type),
    switchMap((action: ReturnType<typeof recordCostCommand>) => {
      const { eventId, name, costCategoryId, amount, date } = action.payload as unknown as { eventId?: string; name: string; costCategoryId?: string; amount: number; date: string };
      return from(costService.addCost({ event_id: eventId ?? null, name, amount, date, cost_category_id: costCategoryId ?? null } as Omit<Cost, 'id' | 'user_id'>)).pipe(
        mergeMap((cost) => of(
          costRecordedEvent(cost),
          showToast({ message: 'Cost recorded successfully!', severity: 'success' })
        )),
        catchError((error) => of(
          costsErrorEvent(error.message),
          showToast({ message: `Error recording cost: ${error.message}`, severity: 'error' })
        ))
      );
    })
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCostEpic = (action$: any) =>
  action$.pipe(
    ofType(updateCostCommand.type),
    switchMap((action: any) => {
      const { costId, updates } = action.payload as { costId: string; updates: Partial<any> };
      return from(costService.updateCost(costId, updates)).pipe(
        map((cost: any) => costUpdatedEvent(cost)),
        catchError((error) => of(costsErrorEvent(error.message)))
      );
    })
  );

export const costsEpics = [
  fetchCostsEpic,
  recordCostEpic,
  updateCostEpic,
];