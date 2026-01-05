import type { ProductBase } from "./product";

/**
 * Price information for a SKU
 */
export interface ProductInventoryPrice {
  mrp: number;
  sellingPrice: number;
}

/**
 * Variant-level attributes (size, color, etc.)
 */
export type ProductInventoryAttributes = Record<string, string>;

/**
 * Lightweight inventory reference
 * (rarely needed, but included for consistency)
 */
export interface ProductInventoryBase {
  id: string;
  sku: string;
  isActive: boolean;
}

/**
 * Full ProductInventory model
 * Represents populated API response
 */
export interface ProductInventory extends ProductInventoryBase {
  product: ProductBase; // populated
  price: ProductInventoryPrice;
  stock: number;
  attributes?: ProductInventoryAttributes;
  createdAt: string;
  updatedAt: string;
}
