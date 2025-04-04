import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate, Enums } from '@/integrations/supabase/types';

type Project = Tables<'Project'>;
type ProjectInsert = TablesInsert<'Project'>;
type ProjectUpdate = TablesUpdate<'Project'>;
type ProjectStatus = Enums<'ProjectStatus'>;

export const projectService = {
  // Get all projects
  async getAll() {
    const { data, error } = await supabase
      .from('Project')
      .select('*, Client(id, name)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a project by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('Project')
      .select('*, Client(id, name, email, phone)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get projects by client
  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('Project')
      .select('*')
      .eq('clientId', clientId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a new project
  async create(project: Omit<ProjectInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newProject: ProjectInsert = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: project.status || 'PENDING',
      ...project
    };

    const { data, error } = await supabase
      .from('Project')
      .insert(newProject)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing project
  async update(id: string, project: Omit<ProjectUpdate, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const updatedProject: ProjectUpdate = {
      ...project,
      updatedAt: now
    };

    const { data, error } = await supabase
      .from('Project')
      .update(updatedProject)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update only the status of a project
  async updateStatus(id: string, status: ProjectStatus) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('Project')
      .update({
        status,
        updatedAt: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a project
  async delete(id: string) {
    const { error } = await supabase
      .from('Project')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};