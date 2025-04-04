
import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-futuristic-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-futuristic-bg-dark to-futuristic-bg">
      <Sidebar />
      
      <div className="md:ml-64 flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
        
        <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-white/5">
          <p>© {new Date().getFullYear()} Nexus - Gestión de Proyectos</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
