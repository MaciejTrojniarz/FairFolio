import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { costService } from '../../../services/costService';
import {
  fetchCostsCommand,
  recordCostCommand,
  costsFetchedEvent,
  costsErrorEvent,
  costRecordedEvent,
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
      const { eventId, name, category, amount, date } = action.payload;
      return from(costService.addCost({ event_id: eventId ?? null, name, category: category ?? null, amount, date })).pipe(
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

export const costsEpics = [
  fetchCostsEpic,
  recordCostEpic,
];