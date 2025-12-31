import "server-only";
import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  coverImage: z.string(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  subcategories: z.array(z.string()).optional(),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  subcategories: z.array(z.string()).optional(),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
