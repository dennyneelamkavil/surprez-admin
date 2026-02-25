import "server-only";
import { z } from "zod";

/* ================= ADDRESS ================= */

const AddressValidation = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  addressLine1: z.string().min(2),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

/* ================= CREATE ================= */

export const CreateCustomerSchema = z.object({
  phone: z.string().min(6),
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  addresses: z.array(AddressValidation).optional(),
  isActive: z.boolean().optional(),
});

/* ================= UPDATE ================= */

export const UpdateCustomerSchema = z.object({
  phone: z.string().min(6).optional(),
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  addresses: z.array(AddressValidation).optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.string().datetime().optional(),
});

/* ================= TYPES ================= */

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
