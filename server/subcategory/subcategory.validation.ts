import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";
import { SeoValidation } from "@/server/seo/seo.validation";

export const CreateSubCategorySchema = z.object({
  name: z.string().min(2),
  image: MediaValidation,
  category: z.string(), // Category ID
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  seo: SeoValidation.optional(),
});

export const UpdateSubCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  image: MediaValidation.optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  seo: SeoValidation.optional(),
});

export type CreateSubCategoryInput = z.infer<typeof CreateSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof UpdateSubCategorySchema>;
