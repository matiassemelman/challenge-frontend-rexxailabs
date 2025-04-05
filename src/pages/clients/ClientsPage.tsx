import React, { useState } from 'react';
import { PlusCircle, Search, SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ClientCard, { Client } from '@/components/clients/ClientCard';
import { toast } from 'sonner';
import { useClients } from '@/hooks/useClients';
import NewClientModal from '@/components/clients/NewClientModal';

const ClientsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  // Use real data from API
  const { getClients, deleteClient } = useClients();
  const clientsQuery = getClients();
  const deleteMutation = deleteClient();

  // Filter clients based on search
  const filteredClients = clientsQuery.data
    ? clientsQuery.data.filter(
        client =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (client.phone && client.phone.includes(searchQuery))
      )
    : [];

  // Event handlers for client actions
  const handleViewClient = (id: string) => {
    toast.info(`Ver cliente con ID: ${id}`);
    // Here we would navigate to client detail page
    // navigate(`/clients/${id}`);
  };

  const handleEditClient = (id: string) => {
    toast.info(`Editar cliente con ID: ${id}`);
    // Here we would navigate to client edit page or open modal
    // navigate(`/clients/${id}/edit`);
  };

  const handleDeleteClient = (id: string) => {
    // Confirm before deleting
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Cliente eliminado correctamente');
        },
        onError: (error) => {
          toast.error(`Error al eliminar cliente: ${error.message}`);
        }
      });
    }
  };

  const handleCreateClient = () => {
    setIsNewClientModalOpen(true);
  };

  // Loading state
  if (clientsQuery.isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando clientes...</div>;
  }

  // Error state
  if (clientsQuery.error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        Error al cargar clientes: {clientsQuery.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground mt-1">Gestione los clientes de su empresa.</p>
      </div>

      {/* New Client Modal */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-10 futuristic-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/10 bg-futuristic-bg-dark/50 hover:bg-futuristic-bg-dark">
                <SlidersHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Todos los clientes
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Con proyectos activos
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Sin proyectos
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Nombre (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Nombre (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Más recientes
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                  Más proyectos
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center rounded-lg border border-white/10 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-muted-foreground'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-muted-foreground'
              }`}
              onClick={() => setViewMode('list')}
            >
              <LayoutList size={16} />
            </Button>
          </div>

          <Button
            className="bg-gradient-button hover:shadow-glow whitespace-nowrap"
            onClick={handleCreateClient}
          >
            <PlusCircle size={16} className="mr-2" /> Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Clients Grid/List */}
      {filteredClients.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onView={handleViewClient}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-futuristic-accent/10 text-futuristic-accent mb-4">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-medium mb-1">No se encontraron clientes</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            {searchQuery
              ? 'No hay clientes que coincidan con su búsqueda. Intente con otros términos o cree un nuevo cliente.'
              : 'No hay clientes registrados. Cree su primer cliente para comenzar.'}
          </p>
          <Button
            className="mt-6 bg-gradient-button hover:shadow-glow"
            onClick={handleCreateClient}
          >
            <PlusCircle size={16} className="mr-2" /> Nuevo Cliente
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
