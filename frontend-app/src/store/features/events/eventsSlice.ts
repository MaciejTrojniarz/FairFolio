import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '../../../types';

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsCommand: (state) => {
      state.loading = true;
      state.error = null;
    }, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addEventCommand: (state, _action: PayloadAction<Omit<Event, 'id'>>) => {
      state.loading = true;
      state.error = null;
    }, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateEventCommand: (state, _action: PayloadAction<Event>) => {
      state.loading = true;
      state.error = null;
    }, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteEventCommand: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    eventsFetchedEvent: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
      state.loading = false;
    },
    eventAddedEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      state.loading = false;
    },
    eventUpdatedEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      state.loading = false;
    },
    eventDeletedEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
      state.loading = false;
    },
    eventsErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchEventsCommand,
  addEventCommand,
  updateEventCommand,
  deleteEventCommand,
  eventsFetchedEvent,
  eventAddedEvent,
  eventUpdatedEvent,
  eventDeletedEvent,
  eventsErrorEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;