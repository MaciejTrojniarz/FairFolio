import { supabase } from '../supabaseClient';
import type { Event } from '../types';

export const eventService = {
  async fetchEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false }); // Sort by start_date descending
    if (error) throw error;
    return data as Event[];
  },

  async addEvent(event: Omit<Event, 'id'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    if (error) throw error;
    return data[0] as Event;
  },

  async updateEvent(event: Event): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', event.id)
      .select();
    if (error) throw error;
    return data[0] as Event;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};