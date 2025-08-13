import { combineEpics } from 'redux-observable';
import { counterEpics } from './features/counter/counterEpics';

export const rootEpic = combineEpics(
  counterEpics
);