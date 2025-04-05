import React, { useEffect, useState } from 'react';
import { Users, FolderKanban, Clock, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import ProjectStatusBadge, { ProjectStatus } from '@/components/projects/ProjectStatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';

interface RecentProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  updatedAt: string;
}

interface RecentClient {
  id: string;
  name: string;
  email: string;
  projectCount: number;
}

const Dashboard = () => {
  // Get real data using hooks
  const { getProjects } = useProjects();
  const { getClients } = useClients();

  const projectsQuery = getProjects();
  const clientsQuery = getClients();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    pendingProjects: 0,
    completedProjects: 0
  });

  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);

  useEffect(() => {
    if (projectsQuery.data && clientsQuery.data) {
      // Calculate stats
      const projects = projectsQuery.data;
      const clients = clientsQuery.data;

      setStats({
        totalClients: clients.length,
        totalProjects: projects.length,
        pendingProjects: projects.filter(p => p.status === 'PENDING').length,
        completedProjects: projects.filter(p => p.status === 'COMPLETED').length
      });

      // Get recent projects
      const formattedProjects = projects
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 4)
        .map(project => ({
          id: project.id,
          name: project.name,
          client: project.client?.name || 'Sin cliente',
          status: project.status as ProjectStatus,
          updatedAt: project.updatedAt
        }));

      setRecentProjects(formattedProjects);

      // Get recent clients
      const formattedClients = clients
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
        .map(client => ({
          id: client.id,
          name: client.name,
          email: client.email,
          projectCount: projects.filter(p => p.clientId === client.id).length
        }));

      setRecentClients(formattedClients);
    }
  }, [projectsQuery.data, clientsQuery.data]);

  // Loading state
  if (projectsQuery.isLoading || clientsQuery.isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando datos del dashboard...</div>;
  }

  // Error state
  if (projectsQuery.error || clientsQuery.error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        Error al cargar datos: {(projectsQuery.error || clientsQuery.error)?.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bienvenido al panel de gestión de proyectos.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Clientes Totales"
          value={stats.totalClients}
          icon={<Users size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Proyectos Totales"
          value={stats.totalProjects}
          icon={<FolderKanban size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Proyectos Pendientes"
          value={stats.pendingProjects}
          icon={<Clock size={24} />}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Proyectos Completados"
          value={stats.completedProjects}
          icon={<CheckCircle size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="futuristic-card overflow-hidden">
          <div className="h-1 bg-gradient-button w-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Proyectos Recientes</CardTitle>
            <CardDescription>Los últimos proyectos actualizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-futuristic-bg-dark/50 hover:bg-futuristic-bg-dark/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">Cliente: {project.client}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <ProjectStatusBadge status={project.status} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hay proyectos recientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card overflow-hidden">
          <div className="h-1 bg-gradient-button w-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Clientes Recientes</CardTitle>
            <CardDescription>Los últimos clientes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.length > 0 ? (
                recentClients.map(client => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-futuristic-bg-dark/50 hover:bg-futuristic-bg-dark/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarFallback className="bg-futuristic-secondary text-white text-xs">
                          {client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{client.name}</h4>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium bg-futuristic-accent/10 text-futuristic-accent px-2 py-1 rounded">
                        {client.projectCount} Proyectos
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hay clientes recientes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Section */}
      <Card className="futuristic-card overflow-hidden">
        <div className="h-1 bg-gradient-button w-full"></div>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Actividad Reciente</CardTitle>
            <CardDescription>Las últimas actualizaciones del sistema</CardDescription>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.length > 0 && (
              <div className="flex gap-3">
                <div className="w-10 flex justify-center">
                  <div className="w-1 h-full bg-futuristic-accent/20 relative rounded-full">
                    <div className="absolute w-3 h-3 rounded-full bg-futuristic-accent -left-1 top-1"></div>
                  </div>
                </div>
                <div className="pb-6">
                  <p className="text-sm">Proyecto <span className="font-medium text-white">{recentProjects[0].name}</span> actualizado</p>
                  <p className="text-xs text-muted-foreground mt-1">Reciente</p>
                </div>
              </div>
            )}

            {recentProjects.find(p => p.status === 'COMPLETED') && (
              <div className="flex gap-3">
                <div className="w-10 flex justify-center">
                  <div className="w-1 h-full bg-futuristic-accent/20 relative rounded-full">
                    <div className="absolute w-3 h-3 rounded-full bg-futuristic-status-completed -left-1 top-1"></div>
                  </div>
                </div>
                <div className="pb-6">
                  <p className="text-sm">Proyecto <span className="font-medium text-white">
                    {recentProjects.find(p => p.status === 'COMPLETED')?.name}
                  </span> marcado como completado</p>
                  <p className="text-xs text-muted-foreground mt-1">Reciente</p>
                </div>
              </div>
            )}

            {recentClients.length > 0 && (
              <div className="flex gap-3">
                <div className="w-10 flex justify-center">
                  <div className="w-1 h-full bg-futuristic-accent/20 relative rounded-full">
                    <div className="absolute w-3 h-3 rounded-full bg-futuristic-status-pending -left-1 top-1"></div>
                  </div>
                </div>
                <div className="pb-6">
                  <p className="text-sm">Nuevo cliente <span className="font-medium text-white">{recentClients[0].name}</span> registrado</p>
                  <p className="text-xs text-muted-foreground mt-1">Reciente</p>
                </div>
              </div>
            )}

            {recentProjects.length === 0 && recentClients.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
