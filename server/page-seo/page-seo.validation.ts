import "server-only";
import { z } from "zod";
import { SeoValidation } from "@/server/seo/seo.validation";

export const CreatePageSeoSchema = z.object({
  pageKey: z
    .string()
    .trim()
    .min(1, "Page key is required")
    .regex(/^[a-z0-9-]+$/, "Page key must be kebab-case"),
  seo: SeoValidation,
  isActive: z.boolean().optional(),
});

export const UpdatePageSeoSchema = z.object({
  seo: SeoValidation.optional(),
  isActive: z.boolean().optional(),
});

export type CreatePageSeoInput = z.infer<typeof CreatePageSeoSchema>;
export type UpdatePageSeoInput = z.infer<typeof UpdatePageSeoSchema>;
