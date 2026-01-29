import type { Media } from "./media";
import type { Seo } from "./seo";
import type { SubCategoryBase } from "./subcategory";

/**
 * Product compliance & regulatory information
 */
export interface ProductCompliance {
  gstin?: string;
  hsnCode?: string;

  manufacturerDetails?: {
    name?: string;
    address?: string;
  };

  certifications?: {
    type: string; // FSSAI, BIS, COSMETIC, etc.
    licenseNumber?: string;
    validTill?: string; // ISO date string
  }[];
}

/**
 * Lightweight product reference
 * Used for lists, relations, and selectors
 */
export interface ProductBase {
  id: string;
  name: string;
  slug: string;
}

/**
 * Product rating info
 */
export interface ProductRating {
  average: number;
  count: number;
}

/**
 * Product warranty info
 */
export interface ProductWarranty {
  period?: string;
  details?: string;
}

/**
 * Flexible product attributes
 * Key-value based, varies by category
 */
export type ProductAttributes = Record<
  string,
  string | number | boolean | string[]
>;

/**
 * Full Product model
 * Represents populated API response
 */
export interface Product extends ProductBase {
  brand: string;
  modelNumber?: string;
  countryOfOrigin: string;

  coverImage: Media;
  images: Media[];
  videos: Media[];

  subcategories: SubCategoryBase[];
  description?: string;
  attributes?: ProductAttributes;

  keyFeatures: string[];
  ingredientsOrMaterial?: string;

  usageInstructions?: string;
  safetyWarnings?: string;

  warranty?: ProductWarranty;
  returnPolicy?: string;

  compliance?: ProductCompliance;

  rating: ProductRating;

  isActive: boolean;
  isFeatured: boolean;

  seo?: Seo;
  createdAt: string;
  updatedAt: string;
}
