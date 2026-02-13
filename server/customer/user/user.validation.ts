import "server-only";
import { z } from "zod";

/**
 * PUT /profile
 * Full profile update
 */
export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100)
    .trim(),

  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
