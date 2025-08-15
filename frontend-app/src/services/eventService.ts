import { supabase } from '../supabaseClient';
import type { Event } from '../types';

export const eventService = {
  async fetchEvents(): Promise<Event[]> {
    // Ensure we only return events owned by the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData.user?.id;
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('creator_id', userId)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data as Event[];
  },

  async addEvent(event: Omit<Event, 'id'>): Promise<Event> {
    // Attach creator_id on insert to enforce ownership
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('events')
      .insert([{ ...event, creator_id: userId }])
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