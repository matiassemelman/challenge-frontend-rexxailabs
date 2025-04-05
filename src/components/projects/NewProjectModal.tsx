import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';

// Schema for form validation
const projectSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres' }),
  clientId: z.string({ required_error: 'Debe seleccionar un cliente' }),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  startDate: z.date({ required_error: 'Debe seleccionar una fecha de inicio' }),
  deliveryDate: z.date({ required_error: 'Debe seleccionar una fecha de entrega' })
    .refine(date => date > new Date(), { message: 'La fecha de entrega debe ser posterior a hoy' })
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  // Get clients data
  const { getClients } = useClients();
  const clientsQuery = getClients();

  // Get create project mutation
  const { createProject } = useProjects();
  const createProjectMutation = createProject();

  // Setup form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'PENDING',
      startDate: new Date(),
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 30))
    }
  });

  // Handle form submission
  const onSubmit = (data: ProjectFormValues) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        form.reset();
      }
    });
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-futuristic-bg-dark border-white/10">
        <div className="h-1 w-full bg-gradient-button absolute top-0 left-0"></div>
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Nuevo Proyecto</DialogTitle>
          <DialogDescription>
            Complete los datos del proyecto. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proyecto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre del proyecto"
                      className="futuristic-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese una descripción del proyecto"
                      className="futuristic-input resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="futuristic-input">
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10 max-h-[300px]">
                        {clientsQuery.isLoading ? (
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : clientsQuery.data && clientsQuery.data.length > 0 ? (
                          clientsQuery.data.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id}
                              className="hover:bg-white/5 focus:bg-white/5"
                            >
                              {client.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-muted-foreground text-center">
                            No hay clientes disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="futuristic-input">
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10">
                        <SelectItem
                          value="PENDING"
                          className="hover:bg-white/5 focus:bg-white/5"
                        >
                          Pendiente
                        </SelectItem>
                        <SelectItem
                          value="IN_PROGRESS"
                          className="hover:bg-white/5 focus:bg-white/5"
                        >
                          En Progreso
                        </SelectItem>
                        <SelectItem
                          value="COMPLETED"
                          className="hover:bg-white/5 focus:bg-white/5"
                        >
                          Completado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="futuristic-input pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Entrega</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="futuristic-input pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-futuristic-bg-dark/95 backdrop-blur-lg border-white/10"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-white/10 hover:border-white/20">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-button hover:shadow-glow"
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Proyecto'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;