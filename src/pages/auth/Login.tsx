import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/use-auth';
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
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error en el inicio de sesión. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-futuristic-bg-dark to-futuristic-bg">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-button mx-auto mb-4 shadow-glow animate-pulse-glow"></div>
          <h1 className="text-3xl font-bold mb-2">Bienvenido de nuevo</h1>
          <p className="text-futuristic-text-secondary">Inicie sesión para continuar</p>
        </div>

        <div className="futuristic-card p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Contraseña</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-futuristic-accent hover:text-futuristic-accent-hover"
                      >
                        ¿Olvidó su contraseña?
                      </Link>
                    </div>
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
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-futuristic-text-secondary">
                  ¿No tiene una cuenta?{' '}
                  <Link
                    to="/register"
                    className="text-futuristic-accent hover:text-futuristic-accent-hover font-medium"
                  >
                    Regístrese
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

export default Login;
