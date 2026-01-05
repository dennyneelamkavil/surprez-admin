import type { Media } from "./media";
import type { SubCategoryBase } from "./subcategory";

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
  coverImage: Media;
  images: Media[];
  videos: Media[];
  subcategories: SubCategoryBase[]; // populated
  description?: string;
  attributes?: ProductAttributes;
  rating: ProductRating;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
