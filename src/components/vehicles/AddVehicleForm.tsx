
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { vehicleSchema, type VehicleFormData } from './validation/vehicleSchema';
import BasicVehicleInfo from './form-sections/BasicVehicleInfo';
import AdditionalVehicleDetails from './form-sections/AdditionalVehicleDetails';
import ServiceInfo from './form-sections/ServiceInfo';

interface AddVehicleFormProps {
  open: boolean;
  onClose: () => void;
  editVehicle?: any;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ open, onClose, editVehicle }) => {
  const { addVehicle, updateVehicle } = useAppContext();
  const { toast } = useToast();
  
  const isEditMode = !!editVehicle;
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: editVehicle?.make || '',
      model: editVehicle?.model || '',
      year: editVehicle?.year || new Date().getFullYear(),
      licensePlate: editVehicle?.licensePlate || '',
      vin: editVehicle?.vin || '',
      color: editVehicle?.color || '',
      currentMileage: editVehicle?.currentMileage || undefined,
      nextServiceMileage: editVehicle?.nextServiceMileage || undefined,
      nextServiceDate: editVehicle?.nextServiceDate || '',
    },
  });
  
  function onSubmit(values: VehicleFormData) {
    if (isEditMode) {
      updateVehicle(editVehicle.id, values);
      toast({
        title: 'Vehicle updated',
        description: `Your ${values.make} ${values.model} has been updated.`,
      });
    } else {
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
              <BasicVehicleInfo form={form} />
              <AdditionalVehicleDetails form={form} />
              <ServiceInfo form={form} />
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
