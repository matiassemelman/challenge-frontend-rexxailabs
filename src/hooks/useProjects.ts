import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { toast } from 'sonner';
import { Enums } from '@/integrations/supabase/types';

type ProjectStatus = Enums<'ProjectStatus'>;
type ProjectError = Error;

export function useProjects() {
  const queryClient = useQueryClient();

  const getProjects = () =>
    useQuery({
      queryKey: ['projects'],
      queryFn: () => projectService.getAll(),
    });

  const getProject = (id: string) =>
    useQuery({
      queryKey: ['projects', id],
      queryFn: () => projectService.getById(id),
      enabled: !!id,
    });

  const getProjectsByClient = (clientId: string) =>
    useQuery({
      queryKey: ['projects', 'client', clientId],
      queryFn: () => projectService.getByClient(clientId),
      enabled: !!clientId,
    });

  const createProject = () =>
    useMutation({
      mutationFn: projectService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.success('Project created successfully');
      },
      onError: (error: ProjectError) => {
        toast.error(error.message || 'Error creating project');
      },
    });

  const updateProject = () =>
    useMutation({
      mutationFn: ({ id, ...data }: { id: string, [key: string]: unknown }) =>
        projectService.update(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
        if (variables.clientId) {
          queryClient.invalidateQueries({
            queryKey: ['projects', 'client', variables.clientId]
          });
        }
        toast.success('Project updated successfully');
      },
      onError: (error: ProjectError) => {
        toast.error(error.message || 'Error updating project');
      },
    });

  const updateProjectStatus = () =>
    useMutation({
      mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
        projectService.updateStatus(id, status),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
        toast.success(`Status updated to ${getStatusLabel(variables.status)}`);
      },
      onError: (error: ProjectError) => {
        toast.error(error.message || 'Error updating status');
      },
    });

  const deleteProject = () =>
    useMutation({
      mutationFn: projectService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.success('Project deleted successfully');
      },
      onError: (error: ProjectError) => {
        toast.error(error.message || 'Error deleting project');
      },
    });

  // Helper function to get status label
  const getStatusLabel = (status: ProjectStatus): string => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      default: return 'Unknown';
    }
  };

  return {
    getProjects,
    getProject,
    getProjectsByClient,
    createProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
  };
}