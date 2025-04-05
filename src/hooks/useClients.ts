import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Client = Tables<'Client'>;
type ClientError = Error;

export function useClients() {
  const queryClient = useQueryClient();

  // Get all clients
  const getClients = () => {
    return useQuery({
      queryKey: ['clients'],
      queryFn: () => clientService.getAll(),
    });
  };

  // Get a client by ID
  const getClient = (id: string) => {
    return useQuery({
      queryKey: ['clients', id],
      queryFn: () => clientService.getById(id),
      enabled: !!id,
    });
  };

  // Create a new client
  const createClient = () => {
    return useMutation({
      mutationFn: clientService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        toast.success('Cliente creado exitosamente');
      },
      onError: (error: ClientError) => {
        toast.error(error.message || 'Error al crear el cliente');
      },
    });
  };

  // Update a client
  const updateClient = () => {
    return useMutation({
      mutationFn: ({ id, ...data }: { id: string, [key: string]: any }) => clientService.update(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
        toast.success('Client updated successfully');
      },
      onError: (error: ClientError) => {
        toast.error(error.message || 'Error updating client');
      },
    });
  };

  // Delete a client
  const deleteClient = () => {
    return useMutation({
      mutationFn: clientService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        toast.success('Client deleted successfully');
      },
      onError: (error: ClientError) => {
        toast.error(error.message || 'Error deleting client');
      },
    });
  };

  return {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
  };
}