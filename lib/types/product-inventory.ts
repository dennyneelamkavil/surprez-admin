import type { ProductBase } from "./product";

/**
 * Price information for a SKU
 */
export interface ProductInventoryPrice {
  mrp: number;
  sellingPrice: number;
  currency?: string;
}

/**
 * Variant-level attributes (size, color, etc.)
 */
export type ProductInventoryAttributes = Record<string, string>;

/**
 * Shipping dimensions
 */
export interface ProductInventoryDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

/**
 * Shipping weight
 */
export interface ProductInventoryWeight {
  value?: number;
  unit?: string;
}

/**
 * Shipping details per SKU
 */
export interface ProductInventoryShipping {
  dimensions?: ProductInventoryDimensions;
  weight?: ProductInventoryWeight;
  handlingTime: number;
  shippingTemplate?: string;
}

/**
 * Lightweight inventory reference
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
  product: ProductBase;

  price: ProductInventoryPrice;
  stock: number;

  attributes?: ProductInventoryAttributes;

  barcode?: string;
  shipping?: ProductInventoryShipping;

  createdAt: string;
  updatedAt: string;
}
