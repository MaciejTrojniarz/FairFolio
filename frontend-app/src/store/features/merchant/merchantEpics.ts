import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { merchantService } from '../../../services/merchantService';
import {
  fetchMerchantCommand,
  merchantFetchedEvent,
  merchantErrorEvent,
} from './merchantSlice';

export const fetchMerchantEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchMerchantCommand.type),
    switchMap(() =>
      from(merchantService.fetchMerchant()).pipe(
        map((merchant) => merchantFetchedEvent(merchant)),
        catchError((error) => of(merchantErrorEvent(error.message)))
      )
    )
  );