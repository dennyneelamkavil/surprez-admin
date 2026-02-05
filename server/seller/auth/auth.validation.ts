import "server-only";
import { z } from "zod";

export const SellerRegisterSchema = z.object({
  businessName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

export type SellerRegisterInput = z.infer<typeof SellerRegisterSchema>;

export const SellerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SellerLoginInput = z.infer<typeof SellerLoginSchema>;
