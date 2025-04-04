
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader, CheckCircle } from 'lucide-react';

export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

const getStatusProps = (status: ProjectStatus) => {
  switch(status) {
    case 'PENDING':
      return {
        color: 'bg-futuristic-status-pending hover:bg-futuristic-status-pending/80 text-white',
        icon: <Clock size={14} />,
        label: 'Pendiente'
      };
    case 'IN_PROGRESS':
      return {
        color: 'bg-futuristic-status-inProgress hover:bg-futuristic-status-inProgress/80 text-white',
        icon: <Loader size={14} className="animate-spin" />,
        label: 'En Progreso'
      };
    case 'COMPLETED':
      return {
        color: 'bg-futuristic-status-completed hover:bg-futuristic-status-completed/80 text-white',
        icon: <CheckCircle size={14} />,
        label: 'Completado'
      };
  }
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ 
  status,
  className = ""
}) => {
  const { color, icon, label } = getStatusProps(status);

  return (
    <Badge
      className={`flex items-center gap-2 py-1 px-3 rounded-full ${color} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </Badge>
  );
};

export default ProjectStatusBadge;
