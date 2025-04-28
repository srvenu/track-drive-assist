
import { z } from 'zod';

// Get current year for validation
const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
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

export type VehicleFormData = z.infer<typeof vehicleSchema>;
