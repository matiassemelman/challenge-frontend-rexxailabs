import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Client = Tables<'Client'>;
type ClientInsert = TablesInsert<'Client'>;
type ClientUpdate = TablesUpdate<'Client'>;

export const clientService = {
  // Get all clients for the current user
  async getAll() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('Client')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a client by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('Client')
      .select('*, Project(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new client
  async create(client: Omit<ClientInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) throw new Error('User not authenticated');

    const now = new Date().toISOString();
    const newClient: ClientInsert = {
      id: crypto.randomUUID(),
      userId,
      createdAt: now,
      updatedAt: now,
      ...client
    };

    const { data, error } = await supabase
      .from('Client')
      .insert(newClient)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing client
  async update(id: string, client: Omit<ClientUpdate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const updatedClient: ClientUpdate = {
      ...client,
      updatedAt: now
    };

    const { data, error } = await supabase
      .from('Client')
      .update(updatedClient)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a client
  async delete(id: string) {
    const { error } = await supabase
      .from('Client')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};