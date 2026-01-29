import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";
import { SeoValidation } from "@/server/seo/seo.validation";

const WarrantyValidation = z.object({
  period: z.string().optional(),
  details: z.string().optional(),
});

const ProductAttributesValidation = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
);

const ProductCertificationValidation = z.object({
  type: z.string().min(1), // FSSAI, BIS, COSMETIC, etc.
  licenseNumber: z.string().optional(),
  validTill: z.string().datetime().optional(),
});

const ManufacturerDetailsValidation = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

const ProductComplianceValidation = z.object({
  gstin: z.string().optional(),
  hsnCode: z.string().min(1).optional(),
  manufacturerDetails: ManufacturerDetailsValidation.optional(),
  certifications: z.array(ProductCertificationValidation).optional(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(1),
  modelNumber: z.string().optional(),
  countryOfOrigin: z.string().min(2),

  coverImage: MediaValidation,
  images: z.array(MediaValidation).optional(),
  videos: z.array(MediaValidation).optional(),

  subcategories: z.array(z.string()).optional(),
  description: z.string().optional(),

  attributes: ProductAttributesValidation.optional(),

  keyFeatures: z.array(z.string()).min(1),
  ingredientsOrMaterial: z.string().optional(),

  usageInstructions: z.string().optional(),
  safetyWarnings: z.string().optional(),

  warranty: WarrantyValidation.optional(),
  returnPolicy: z.string().optional(),

  compliance: ProductComplianceValidation.optional(),

  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),

  seo: SeoValidation.optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  brand: z.string().min(1).optional(),
  modelNumber: z.string().optional(),
  countryOfOrigin: z.string().min(2).optional(),

  coverImage: MediaValidation.optional(),
  images: z.array(MediaValidation).optional(),
  videos: z.array(MediaValidation).optional(),

  subcategories: z.array(z.string()).optional(),
  description: z.string().optional(),

  attributes: ProductAttributesValidation.optional(),

  keyFeatures: z.array(z.string()).min(1).optional(),
  ingredientsOrMaterial: z.string().optional(),

  usageInstructions: z.string().optional(),
  safetyWarnings: z.string().optional(),

  warranty: WarrantyValidation.optional(),
  returnPolicy: z.string().optional(),

  compliance: ProductComplianceValidation.optional(),

  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),

  seo: SeoValidation.optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
