import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";
import { SeoValidation } from "@/server/seo/seo.validation";

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  coverImage: MediaValidation,
  images: z.array(MediaValidation).optional(),
  videos: z.array(MediaValidation).optional(),
  subcategories: z.array(z.string()).optional(),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seo: SeoValidation.optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  coverImage: MediaValidation.optional(),
  images: z.array(MediaValidation).optional(),
  videos: z.array(MediaValidation).optional(),
  subcategories: z.array(z.string()).optional(),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seo: SeoValidation.optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
