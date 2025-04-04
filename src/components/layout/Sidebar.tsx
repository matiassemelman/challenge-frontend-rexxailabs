
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: FolderKanban, label: 'Proyectos', path: '/projects' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  const toggleSidebar = () => setCollapsed(prev => !prev);
  const toggleMobileMenu = () => setMobileOpen(prev => !prev);

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50 bg-futuristic-bg-dark/80 backdrop-blur-md"
        onClick={toggleMobileMenu}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-gradient-sidebar border-r border-white/5 shadow-lg transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="p-4 flex items-center justify-between h-16">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-button animate-pulse-glow"></div>
              <h1 className="text-white font-bold text-xl">Nexus</h1>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            <ChevronRight size={20} className={cn("transition-transform", collapsed ? "rotate-0" : "rotate-180")} />
          </Button>
        </div>
      
        {/* Navigation */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <div 
                    className={cn(
                      "flex items-center py-3 px-3 rounded-lg transition-all duration-200",
                      isActiveRoute(item.path) 
                        ? "bg-futuristic-accent text-white shadow-glow-sm" 
                        : "text-futuristic-text-secondary hover:bg-white/5"
                    )}
                  >
                    <item.icon size={22} className="min-w-[22px]" />
                    {!collapsed && (
                      <span className="ml-3 whitespace-nowrap">{item.label}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      
        {/* Sidebar footer with logout */}
        <div className="absolute bottom-0 w-full p-3 border-t border-white/5">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full text-futuristic-text-secondary hover:bg-white/5",
              collapsed ? "justify-center" : "justify-start"
            )}
            onClick={logout}
          >
            <LogOut size={22} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
