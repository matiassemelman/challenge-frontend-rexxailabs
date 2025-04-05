import React, { useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';

// Schema for form validation
const clientSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Por favor, ingrese una dirección de correo válida' }),
  phone: z.string().optional()
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  // Get create client mutation
  const { createClient } = useClients();
  const createClientMutation = createClient();

  // Setup form with default values
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  });

  // Handle form submission
  const onSubmit = (data: ClientFormValues) => {
    createClientMutation.mutate(data, {
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
      <DialogContent className="sm:max-w-[500px] bg-futuristic-bg-dark border-white/10">
        <div className="h-1 w-full bg-gradient-button absolute top-0 left-0"></div>
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Complete los datos del cliente. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre del cliente"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el correo del cliente"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el teléfono del cliente"
                      className="futuristic-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-white/10 hover:border-white/20">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-button hover:shadow-glow"
                disabled={createClientMutation.isPending}
              >
                {createClientMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Cliente'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientModal;