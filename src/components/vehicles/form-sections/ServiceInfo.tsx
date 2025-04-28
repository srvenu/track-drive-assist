
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '../validation/vehicleSchema';

interface ServiceInfoProps {
  form: UseFormReturn<VehicleFormData>;
}

const ServiceInfo = ({ form }: ServiceInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default ServiceInfo;
