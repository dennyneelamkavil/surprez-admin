import type { Media } from "./media";

/**
 * Lightweight category reference
 * Used for dropdowns, relations, and lists
 */
export interface CategoryBase {
  id: string;
  name: string;
  slug: string;
}

/**
 * Full Category model
 * Represents populated API response
 */
export interface Category extends CategoryBase {
  image: Media;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
