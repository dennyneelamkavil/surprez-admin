import "server-only";
import { z } from "zod";

export const CreateSubCategorySchema = z.object({
  name: z.string().min(2),
  image: z.string(),
  category: z.string(), // Category ID
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateSubCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateSubCategoryInput = z.infer<typeof CreateSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof UpdateSubCategorySchema>;
