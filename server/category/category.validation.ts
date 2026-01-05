import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";

export const CreateCategorySchema = z.object({
  name: z.string().min(2),
  image: MediaValidation,
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  image: MediaValidation.optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
