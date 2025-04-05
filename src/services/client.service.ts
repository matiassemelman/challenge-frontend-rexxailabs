import api from '@/services/api';
import { Tables } from '@/integrations/supabase/types';
import { projectService } from './project.service';

type Client = Tables<'Client'>;
type ClientError = Error;

export const clientService = {
  // Get all clients
  async getAll() {
    const response = await api.get('/clients');
    const clients = response.data;

    // Fetch all projects to associate with clients
    try {
      const projects = await projectService.getAll();

      // Add projects property to each client
      return clients.map(client => ({
        ...client,
        projects: projects.filter(project => project.clientId === client.id)
      }));
    } catch (error) {
      console.error('Error fetching projects for clients:', error);
      // If we fail to get projects, still return clients but with empty projects array
      return clients.map(client => ({
        ...client,
        projects: []
      }));
    }
  },

  // Get a client by ID
  async getById(id: string) {
    const response = await api.get(`/clients/${id}`);
    const client = response.data;

    // Fetch projects for this client
    try {
      const projects = await projectService.getByClient(id);
      return {
        ...client,
        projects
      };
    } catch (error) {
      console.error(`Error fetching projects for client ${id}:`, error);
      // Return client with empty projects array
      return {
        ...client,
        projects: []
      };
    }
  },

  // Create a new client
  async create(client: Omit<any, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/clients', client);
    return {
      ...response.data,
      projects: []
    };
  },

  // Update an existing client
  async update(id: string, client: any) {
    const response = await api.put(`/clients/${id}`, client);

    // Maintain projects from the original client
    const originalClient = await this.getById(id);
    return {
      ...response.data,
      projects: originalClient.projects || []
    };
  },

  // Delete a client
  async delete(id: string) {
    await api.delete(`/clients/${id}`);
    return true;
  }
};