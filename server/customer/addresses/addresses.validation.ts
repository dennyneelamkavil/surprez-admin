import "server-only";
import { z } from "zod";

const BaseAddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  phone: z.string().min(10, "Invalid phone number").max(15).trim(),
  addressLine1: z.string().min(3, "Address line 1 is required").max(200).trim(),
  addressLine2: z.string().max(200).trim().optional(),
  city: z.string().min(2, "City is required").max(100).trim(),
  state: z.string().min(2, "State is required").max(100).trim(),
  pincode: z.string().min(4, "Invalid pincode").max(10).trim(),
  country: z.string().max(100).trim().default("India"),
  isDefault: z.boolean().optional(),
});

export const CreateAddressSchema = BaseAddressSchema;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = BaseAddressSchema;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;
