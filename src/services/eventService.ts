import { supabase, Event } from '../lib/supabase';

export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return data || [];
  },

  // Get event by ID
  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      return null;
    }
    return data;
  },

  // Add event
  async addEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    console.log('eventService.addEvent called with:', event);
    
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding event:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('Event data that was sent:', JSON.stringify(event, null, 2));
      return null;
    }
    
    console.log('Event added successfully:', data);
    return data;
  },

  // Update event
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    console.log('eventService.updateEvent called with:', { id, updates });
    
    const { data, error } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('Update data that was sent:', JSON.stringify(updates, null, 2));
      console.error('Event ID:', id);
      console.error('Update query:', { id, updates, updated_at: new Date().toISOString() });
      return null;
    }
    
    console.log('Event updated successfully:', data);
    return data;
  },

  // Delete event
  async deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }
    return true;
  },
};
