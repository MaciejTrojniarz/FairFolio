import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { delay, mapTo } from 'rxjs/operators';
import { increment } from './counterSlice';

export const counterEpics = (action$: any) =>
  action$.pipe(
    ofType('INCREMENT_ASYNC'),
    delay(1000), // Simulate async operation
    mapTo(increment())
  );