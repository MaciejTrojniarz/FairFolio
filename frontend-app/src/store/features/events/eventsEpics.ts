import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { eventService } from '../../../services/eventService';
import {
  fetchEventsCommand,
  addEventCommand,
  updateEventCommand,
  deleteEventCommand,
  eventsFetchedEvent,
  eventAddedEvent,
  eventUpdatedEvent,
  eventDeletedEvent,
  eventsErrorEvent,
} from './eventsSlice';
import type { Event } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchEventsEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchEventsCommand.type),
    switchMap(() =>
      from(eventService.fetchEvents()).pipe(
        map((events: Event[]) => eventsFetchedEvent(events)),
        catchError((error) => of(eventsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addEventEpic = (action$: any) =>
  action$.pipe(
    ofType(addEventCommand.type),
    switchMap((action: ReturnType<typeof addEventCommand>) =>
      from(eventService.addEvent(action.payload)).pipe(
        map((event: Event) => eventAddedEvent(event)),
        catchError((error) => of(eventsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateEventEpic = (action$: any) =>
  action$.pipe(
    ofType(updateEventCommand.type),
    switchMap((action: ReturnType<typeof updateEventCommand>) =>
      from(eventService.updateEvent(action.payload)).pipe(
        map((event: Event) => eventUpdatedEvent(event)),
        catchError((error) => of(eventsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteEventEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteEventCommand.type),
    switchMap((action: ReturnType<typeof deleteEventCommand>) =>
      from(eventService.deleteEvent(action.payload)).pipe(
        map(() => eventDeletedEvent(action.payload)),
        catchError((error) => of(eventsErrorEvent(error.message)))
      )
    )
  );

export const eventsEpics = [
  fetchEventsEpic,
  addEventEpic,
  updateEventEpic,
  deleteEventEpic,
];