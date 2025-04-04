
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { register, isLoading } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      await register(data.name, data.email, data.password);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Error en el registro. Por favor, inténtelo de nuevo.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-futuristic-bg-dark to-futuristic-bg">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-button mx-auto mb-4 shadow-glow animate-pulse-glow"></div>
          <h1 className="text-3xl font-bold mb-2">Crear una cuenta</h1>
          <p className="text-futuristic-text-secondary">Regístrese para comenzar</p>
        </div>
        
        <div className="futuristic-card p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input 
                        className="futuristic-input"
                        placeholder="Juan Pérez" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        className="futuristic-input"
                        placeholder="nombre@empresa.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        className="futuristic-input"
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        className="futuristic-input"
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-button hover:shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white animate-spin"></div>
                    <span>Registrando...</span>
                  </div>
                ) : (
                  'Registrarse'
                )}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-futuristic-text-secondary">
                  ¿Ya tiene una cuenta?{' '}
                  <Link 
                    to="/login" 
                    className="text-futuristic-accent hover:text-futuristic-accent-hover font-medium"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Nexus - Gestión de Proyectos</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
