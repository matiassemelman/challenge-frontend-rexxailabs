import api from '@/services/api';
import { Tables, Enums } from '@/integrations/supabase/types';

type Project = Tables<'Project'>;
type ProjectStatus = Enums<'ProjectStatus'>;
type ProjectError = Error;

export const projectService = {
  // Get all projects
  async getAll() {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get a project by ID
  async getById(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Get projects by client
  async getByClient(clientId: string) {
    const response = await api.get('/projects', {
      params: { clientId }
    });
    return response.data;
  },

  // Create a new project
  async create(project: Record<string, any>) {
    const response = await api.post('/projects', project);
    return response.data;
  },

  // Update an existing project
  async update(id: string, project: Record<string, any>) {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },

  // Update only the status of a project
  async updateStatus(id: string, status: ProjectStatus) {
    const response = await api.put(`/projects/${id}`, { status });
    return response.data;
  },

  // Delete a project
  async delete(id: string) {
    await api.delete(`/projects/${id}`);
    return true;
  }
};