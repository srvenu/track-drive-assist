
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

// Get current year for validation
const currentYear = new Date().getFullYear();

const vehicleSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.coerce
    .number()
    .int()
    .min(1900, { message: 'Year must be 1900 or later' })
    .max(currentYear + 1, { message: `Year cannot be later than ${currentYear + 1}` }),
  licensePlate: z.string().min(1, { message: 'License plate is required' }),
  vin: z.string().optional(),
  color: z.string().optional(),
  currentMileage: z.coerce
    .number()
    .int()
    .min(0, { message: 'Mileage must be a positive number' })
    .optional(),
  nextServiceMileage: z.coerce
    .number()
    .int()
    .min(0, { message: 'Mileage must be a positive number' })
    .optional(),
  nextServiceDate: z.string().optional(),
});

interface AddVehicleFormProps {
  open: boolean;
  onClose: () => void;
  editVehicle?: any;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ open, onClose, editVehicle }) => {
  const { addVehicle, updateVehicle } = useAppContext();
  const { toast } = useToast();
  
  const isEditMode = !!editVehicle;
  
  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: editVehicle?.make || '',
      model: editVehicle?.model || '',
      year: editVehicle?.year || currentYear,
      licensePlate: editVehicle?.licensePlate || '',
      vin: editVehicle?.vin || '',
      color: editVehicle?.color || '',
      currentMileage: editVehicle?.currentMileage || undefined,
      nextServiceMileage: editVehicle?.nextServiceMileage || undefined,
      nextServiceDate: editVehicle?.nextServiceDate || '',
    },
  });
  
  function onSubmit(values: z.infer<typeof vehicleSchema>) {
    if (isEditMode) {
      updateVehicle(editVehicle.id, values);
      toast({
        title: 'Vehicle updated',
        description: `Your ${values.make} ${values.model} has been updated.`,
      });
    } else {
      // Ensure required values are present before passing to addVehicle
      addVehicle({
        make: values.make,
        model: values.model,
        year: values.year,
        licensePlate: values.licensePlate,
        vin: values.vin,
        color: values.color,
        currentMileage: values.currentMileage,
        nextServiceMileage: values.nextServiceMileage,
        nextServiceDate: values.nextServiceDate,
      });
      toast({
        title: 'Vehicle added',
        description: `Your ${values.make} ${values.model} has been added.`,
      });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota, Honda, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Camry, CR-V, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2022" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Silver, Blue, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Vehicle Identification Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentMileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Mileage</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nextServiceMileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Service Mileage</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="55000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nextServiceDate"
                render={({ field }) => (
                  <FormItem className="col-span-1 sm:col-span-2">
                    <FormLabel>Next Service Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleForm;
