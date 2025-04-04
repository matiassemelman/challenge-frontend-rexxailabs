
import React from 'react';
import { Users, FolderKanban, Clock, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import ProjectStatusBadge, { ProjectStatus } from '@/components/projects/ProjectStatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
  // Mock data
  const recentProjects: RecentProject[] = [
    { id: '1', name: 'Rediseño Web Corporativa', client: 'Empresa A', status: 'IN_PROGRESS', updatedAt: '2023-04-01' },
    { id: '2', name: 'App Móvil de Ventas', client: 'Empresa B', status: 'PENDING', updatedAt: '2023-03-28' },
    { id: '3', name: 'Integración CRM', client: 'Empresa C', status: 'COMPLETED', updatedAt: '2023-03-25' },
    { id: '4', name: 'Plataforma E-learning', client: 'Empresa D', status: 'IN_PROGRESS', updatedAt: '2023-03-20' },
  ];
  
  const recentClients: RecentClient[] = [
    { id: '1', name: 'Empresa A', email: 'contacto@empresaa.com', projectCount: 3 },
    { id: '2', name: 'Empresa B', email: 'contacto@empresab.com', projectCount: 1 },
    { id: '3', name: 'Empresa C', email: 'contacto@empresac.com', projectCount: 2 },
    { id: '4', name: 'Empresa D', email: 'contacto@empresad.com', projectCount: 1 },
  ];
  
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
          value={12}
          icon={<Users size={24} />}
          trend={{ value: 10, isPositive: true }}
        />
        <StatCard 
          title="Proyectos Totales"
          value={24}
          icon={<FolderKanban size={24} />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Proyectos Pendientes"
          value={8}
          icon={<Clock size={24} />}
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard 
          title="Proyectos Completados"
          value={14}
          icon={<CheckCircle size={24} />}
          trend={{ value: 12, isPositive: true }}
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
              {recentProjects.map(project => (
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
              ))}
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
              {recentClients.map(client => (
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
              ))}
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
            <div className="flex gap-3">
              <div className="w-10 flex justify-center">
                <div className="w-1 h-full bg-futuristic-accent/20 relative rounded-full">
                  <div className="absolute w-3 h-3 rounded-full bg-futuristic-accent -left-1 top-1"></div>
                </div>
              </div>
              <div className="pb-6">
                <p className="text-sm">Proyecto <span className="font-medium text-white">App Móvil de Ventas</span> creado</p>
                <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-10 flex justify-center">
                <div className="w-1 h-full bg-futuristic-accent/20 relative rounded-full">
                  <div className="absolute w-3 h-3 rounded-full bg-futuristic-status-completed -left-1 top-1"></div>
                </div>
              </div>
              <div className="pb-6">
                <p className="text-sm">Proyecto <span className="font-medium text-white">Integración CRM</span> marcado como completado</p>
                <p className="text-xs text-muted-foreground mt-1">Hace 5 horas</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-10 flex justify-center">
                <div className="w-1 h-full bg-futuristic-accent/20 relative rounded-full">
                  <div className="absolute w-3 h-3 rounded-full bg-futuristic-status-pending -left-1 top-1"></div>
                </div>
              </div>
              <div className="pb-6">
                <p className="text-sm">Nuevo cliente <span className="font-medium text-white">Empresa D</span> registrado</p>
                <p className="text-xs text-muted-foreground mt-1">Hace 1 día</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
