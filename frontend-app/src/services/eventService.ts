import { supabase } from '../supabaseClient';
import type { Event } from '../types';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_API_BASE_URL = 'http://localhost:3001';

export const eventService = {
  async fetchEvents(): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching events from mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Failed to fetch mock events');
      return response.json();
    }

    const { data, error } = await supabase
      .from('events')
      .select('*');
    if (error) throw error;
    return data as Event[];
  },

  async addEvent(event: Omit<Event, 'id'>): Promise<Event> {
    if (USE_MOCK_DATA) {
      console.log('Adding event to mock server...');
      const newEvent = {
        ...event,
        id: `mock-event-${Date.now()}`,
      };
      const response = await fetch(`${MOCK_API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (!response.ok) throw new Error('Failed to add mock event');
      return response.json();
    }

    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    if (error) throw error;
    return data[0] as Event;
  },

  async updateEvent(event: Event): Promise<Event> {
    if (USE_MOCK_DATA) {
      console.log('Updating event on mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update mock event');
      return response.json();
    }

    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', event.id)
      .select();
    if (error) throw error;
    return data[0] as Event;
  },

  async deleteEvent(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('Deleting event from mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete mock event');
      return;
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};