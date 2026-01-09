import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";
import { SeoValidation } from "@/server/seo/seo.validation";

export const CreateCategorySchema = z.object({
  name: z.string().min(2),
  image: MediaValidation,
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  seo: SeoValidation.optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  image: MediaValidation.optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  seo: SeoValidation.optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
