
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '../validation/vehicleSchema';

interface BasicVehicleInfoProps {
  form: UseFormReturn<VehicleFormData>;
}

const BasicVehicleInfo = ({ form }: BasicVehicleInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicVehicleInfo;
