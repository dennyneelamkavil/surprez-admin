import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";

export const SeoValidation = z.object({
  title: z
    .string()
    .trim()
    .max(70, "SEO title must be 70 characters or less")
    .optional(),
  description: z
    .string()
    .trim()
    .max(160, "SEO description must be 160 characters or less")
    .optional(),
  keywords: z.array(z.string().trim()).optional(),
  canonical: z.string().trim().url("Canonical must be a valid URL").optional(),
  noIndex: z.boolean().optional(),
  ogImage: MediaValidation.optional(),
});
