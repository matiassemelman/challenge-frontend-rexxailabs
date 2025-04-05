import React, { useState } from 'react';
import { PlusCircle, Search, SlidersHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProjectStatusBadge, { ProjectStatus } from '@/components/projects/ProjectStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useProjects } from '@/hooks/useProjects';
import NewProjectModal from '@/components/projects/NewProjectModal';

interface Project {
  id: string;
  name: string;
  description: string;
  client: {
    id: string;
    name: string;
  };
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget?: number;
}

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Use real data from API
  const { getProjects, updateProjectStatus } = useProjects();
  const projectsQuery = getProjects();
  const statusMutation = updateProjectStatus();

  // Filter projects based on search and status
  const filteredProjects = projectsQuery.data
    ? projectsQuery.data.filter(project => {
        const matchesSearch =
          searchQuery === '' ||
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.client?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Project counts by status
  const pendingCount = projectsQuery.data
    ? projectsQuery.data.filter(p => p.status === 'PENDING').length
    : 0;

  const inProgressCount = projectsQuery.data
    ? projectsQuery.data.filter(p => p.status === 'IN_PROGRESS').length
    : 0;

  const completedCount = projectsQuery.data
    ? projectsQuery.data.filter(p => p.status === 'COMPLETED').length
    : 0;

  // Event handlers
  const handleCreateProject = () => {
    setIsNewProjectModalOpen(true);
  };

  const handleNewProjectModalClose = () => {
    setIsNewProjectModalOpen(false);
  };

  const handleChangeStatus = (projectId: string, newStatus: ProjectStatus) => {
    statusMutation.mutate({ id: projectId, status: newStatus });
  };

  const handleViewProject = (projectId: string) => {
    toast.info(`Ver detalles del proyecto ${projectId}`);
    // Here we would navigate to project detail page
    // navigate(`/projects/${projectId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Loading state
  if (projectsQuery.isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando proyectos...</div>;
  }

  // Error state
  if (projectsQuery.error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        Error al cargar proyectos: {projectsQuery.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
        <p className="text-muted-foreground mt-1">Gestione los proyectos de su empresa.</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar proyectos..."
            className="pl-10 futuristic-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-white/10 bg-futuristic-bg-dark/50 hover:bg-futuristic-bg-dark">
                <Filter size={16} className="mr-2" />
                {statusFilter === 'ALL' ? 'Todos' :
                  statusFilter === 'PENDING' ? 'Pendientes' :
                  statusFilter === 'IN_PROGRESS' ? 'En Progreso' : 'Completados'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10">
              <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                  onClick={() => setStatusFilter('ALL')}
                >
                  Todos los proyectos
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                  onClick={() => setStatusFilter('PENDING')}
                >
                  <span>Pendientes</span>
                  <Badge className="bg-futuristic-status-pending text-white ml-2">
                    {pendingCount}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                  onClick={() => setStatusFilter('IN_PROGRESS')}
                >
                  <span>En Progreso</span>
                  <Badge className="bg-futuristic-status-inProgress text-white ml-2">
                    {inProgressCount}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                  onClick={() => setStatusFilter('COMPLETED')}
                >
                  <span>Completados</span>
                  <Badge className="bg-futuristic-status-completed text-white ml-2">
                    {completedCount}
                  </Badge>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/10 bg-futuristic-bg-dark/50 hover:bg-futuristic-bg-dark">
                <SlidersHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Fecha de inicio (reciente)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Fecha de inicio (antiguo)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Cliente (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Presupuesto (mayor)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Presupuesto (menor)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-gradient-button hover:shadow-glow whitespace-nowrap"
            onClick={handleCreateProject}
          >
            <PlusCircle size={16} className="mr-2" /> Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={handleNewProjectModalClose}
      />

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <Card
              key={project.id}
              className="futuristic-card overflow-hidden hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
              onClick={() => handleViewProject(project.id)}
            >
              <div className={`h-1 w-full ${
                project.status === 'PENDING' ? 'bg-futuristic-status-pending' :
                project.status === 'IN_PROGRESS' ? 'bg-futuristic-status-inProgress' :
                'bg-futuristic-status-completed'
              }`}></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                    <div className="flex items-center text-xs text-futuristic-text-muted mt-1">
                      <span>Cliente: {project.client?.name || 'Sin cliente'}</span>
                      <span className="mx-2">•</span>
                      <span>Inicio: {formatDate(project.startDate)}</span>
                      {project.endDate && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Fin: {formatDate(project.endDate)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {project.budget && (
                      <Badge variant="outline" className="bg-futuristic-accent/10 text-futuristic-text-secondary border-futuristic-accent/20">
                        {formatCurrency(project.budget)}
                      </Badge>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-white/20">
                          <ProjectStatusBadge status={project.status} className="py-0.5 px-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10">
                        <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeStatus(project.id, 'PENDING');
                          }}
                          className="hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                        >
                          <ProjectStatusBadge status="PENDING" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeStatus(project.id, 'IN_PROGRESS');
                          }}
                          className="hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                        >
                          <ProjectStatusBadge status="IN_PROGRESS" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeStatus(project.id, 'COMPLETED');
                          }}
                          className="hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
                        >
                          <ProjectStatusBadge status="COMPLETED" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-futuristic-accent/10 text-futuristic-accent mb-4">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-medium mb-1">No se encontraron proyectos</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No hay proyectos que coincidan con su búsqueda. Intente con otros términos o cambie los filtros.'
              : 'No hay proyectos registrados. Cree su primer proyecto para comenzar.'}
          </p>
          <Button
            className="mt-6 bg-gradient-button hover:shadow-glow"
            onClick={handleCreateProject}
          >
            <PlusCircle size={16} className="mr-2" /> Nuevo Proyecto
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
