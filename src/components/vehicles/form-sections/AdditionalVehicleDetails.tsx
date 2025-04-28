
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '../validation/vehicleSchema';

interface AdditionalVehicleDetailsProps {
  form: UseFormReturn<VehicleFormData>;
}

const AdditionalVehicleDetails = ({ form }: AdditionalVehicleDetailsProps) => {
  return (
    <>
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
    </>
  );
};

export default AdditionalVehicleDetails;
