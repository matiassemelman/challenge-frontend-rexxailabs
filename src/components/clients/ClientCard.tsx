import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projects?: { id: string }[];
}

interface ClientCardProps {
  client: Client;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onView,
  onEdit,
  onDelete
}) => {
  // Get the number of projects safely
  const projectCount = client.projects?.length || 0;

  return (
    <Card className="futuristic-card futuristic-card-hover overflow-hidden">
      <div className="h-2 bg-gradient-button w-full"></div>
      <CardContent className="pt-6">
        <h3 className="text-white text-lg font-semibold mb-4">{client.name}</h3>
        <p className="text-futuristic-text-secondary mb-2">{client.email}</p>
        {client.phone && (
          <p className="text-futuristic-text-secondary mb-4">{client.phone}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-futuristic-bg-dark/30 px-6 py-3">
        <Badge
          variant="outline"
          className="bg-futuristic-accent/10 text-futuristic-text-secondary border-futuristic-accent/20"
        >
          {projectCount} Proyectos
        </Badge>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
            onClick={() => onView && onView(client.id)}
          >
            <Eye size={18} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            onClick={() => onEdit && onEdit(client.id)}
          >
            <Pencil size={18} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={() => onDelete && onDelete(client.id)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
