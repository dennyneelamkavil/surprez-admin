import "server-only";
import { z } from "zod";

export const RequestOtpSchema = z.object({
  phone: z.string().min(10),
});

export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;

export const VerifyOtpSchema = z.object({
  phone: z.string(),
  otp: z.string().length(6),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const CompleteProfileSchema = z.object({
  fullName: z.string().min(2),
  email: z.email().optional(),
});

export type CompleteProfileInput = z.infer<typeof CompleteProfileSchema>;
