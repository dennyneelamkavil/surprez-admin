import type { Media } from "./media";
import type { CategoryBase } from "./category";

/**
 * Lightweight subcategory reference
 * Used for dropdowns, relations, and lists
 */
export interface SubCategoryBase {
  id: string;
  name: string;
  slug: string;
}

/**
 * Full SubCategory model
 * Represents populated API response
 */
export interface SubCategory extends SubCategoryBase {
  image: Media;
  category: CategoryBase; // populated
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
