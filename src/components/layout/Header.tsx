import React from 'react';
import { useAuth } from '@/context/use-auth';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-white/5 bg-futuristic-bg-dark/50 backdrop-blur-lg flex items-center justify-between px-6">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-futuristic-accent/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-white"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-futuristic-accent rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
            >
              <Avatar className="h-9 w-9 border border-white/10">
                <AvatarFallback className="bg-futuristic-secondary text-white">
                  {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
            >
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
            >
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={logout}
              className="text-muted-foreground hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
            >
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
