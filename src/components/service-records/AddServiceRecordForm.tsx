
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ServiceRecord } from '@/contexts/AppContext';

const serviceRecordSchema = z.object({
  vehicleId: z.string().min(1, { message: 'Vehicle is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  serviceType: z.string().min(1, { message: 'Service type is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  cost: z.coerce
    .number()
    .min(0, { message: 'Cost must be a positive number' }),
  mileage: z.coerce
    .number()
    .int()
    .min(0, { message: 'Mileage must be a positive number' }),
  serviceCenter: z.string().min(1, { message: 'Service center is required' }),
  notes: z.string().optional(),
});

interface AddServiceRecordFormProps {
  open: boolean;
  onClose: () => void;
  presetVehicleId?: string;
  editRecord?: ServiceRecord;
}

const serviceTypes = [
  'Oil Change',
  'Brake Service',
  'Tire Rotation',
  'Alignment',
  'Battery Replacement',
  'Air Filter',
  'Spark Plugs',
  'Transmission Service',
  'Coolant Flush',
  'Fuel System Service',
  'Other'
];

const AddServiceRecordForm: React.FC<AddServiceRecordFormProps> = ({ 
  open, 
  onClose, 
  presetVehicleId,
  editRecord
}) => {
  const { vehicles, addServiceRecord, updateServiceRecord } = useAppContext();
  const { toast } = useToast();
  
  const isEditMode = !!editRecord;

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  const form = useForm<z.infer<typeof serviceRecordSchema>>({
    resolver: zodResolver(serviceRecordSchema),
    defaultValues: {
      vehicleId: editRecord?.vehicleId || presetVehicleId || '',
      date: formatDateForInput(editRecord?.date) || new Date().toISOString().split('T')[0],
      serviceType: editRecord?.serviceType || '',
      description: editRecord?.description || '',
      cost: editRecord?.cost || 0,
      mileage: editRecord?.mileage || 0,
      serviceCenter: editRecord?.serviceCenter || '',
      notes: editRecord?.notes || '',
    },
  });
  
  function onSubmit(values: z.infer<typeof serviceRecordSchema>) {
    if (isEditMode && editRecord) {
      updateServiceRecord(editRecord.id, values);
      toast({
        title: 'Service record updated',
        description: `The service record for ${values.serviceType} has been updated.`,
      });
    } else {
      addServiceRecord(values);
      toast({
        title: 'Service record added',
        description: `A new service record for ${values.serviceType} has been added.`,
      });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Service Record' : 'Add Service Record'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {!presetVehicleId && (
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!!presetVehicleId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="serviceCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Center</FormLabel>
                    <FormControl>
                      <Input placeholder="Service center name" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the service" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes" 
                        className="resize-none"
                        {...field} 
                      />
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
                {isEditMode ? 'Update Record' : 'Add Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceRecordForm;
