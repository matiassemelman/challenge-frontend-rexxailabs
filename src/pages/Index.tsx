
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page
    navigate('/login');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-futuristic-bg-dark to-futuristic-bg">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-button mx-auto mb-4 animate-pulse-glow"></div>
        <h1 className="text-4xl font-bold mb-4">Nexus - Gestión de Proyectos</h1>
        <p className="text-xl text-futuristic-text-secondary">Cargando...</p>
      </div>
    </div>
  );
};

export default Index;
