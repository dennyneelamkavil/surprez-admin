import type { ProductBase } from "./product";
import type { UserBase } from "./user";

/**
 * Lightweight review reference
 * Useful for lists or moderation tables
 */
export interface ReviewBase {
  id: string;
  rating: number;
  isVerifiedPurchase: boolean;
}

/**
 * Full Review model
 * Represents populated API response
 */
export interface Review extends ReviewBase {
  product: ProductBase; // populated
  user: UserBase; // populated
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
