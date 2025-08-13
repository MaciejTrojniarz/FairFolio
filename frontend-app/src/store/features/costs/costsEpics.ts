import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { costService } from '../../../services/costService';
import {
  fetchCostsCommand,
  costsFetchedEvent,
  costsErrorEvent,
} from './costsSlice';
import type { Cost } from '../../../types';

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

export const costsEpics = [
  fetchCostsEpic,
];