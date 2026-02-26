import type { CustomerBase } from "./customer";
import { SellerBase } from "./seller";

/**
 * Order item price snapshot
 * Stored to preserve historical pricing
 */
export interface OrderItemPrice {
  mrp: number;
  sellingPrice: number;
}

/**
 * Single item inside an order
 */
export interface OrderItem {
  product: string; // Product ID
  inventory: string; // ProductInventory ID
  quantity: number;

  price: OrderItemPrice;
}

/**
 * Delivery address snapshot
 * Saved at order time (immutable)
 */
export interface OrderAddressSnapshot {
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

/**
 * Order totals snapshot
 */
export interface OrderTotals {
  mrpTotal?: number;
  sellingTotal?: number;
  discountTotal?: number;
  payableTotal?: number;
}

/**
 * Payment status enum
 */
export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";

/**
 * Order lifecycle status
 */
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * Lightweight order reference
 * Used for lists & tables
 */
export interface OrderBase {
  id: string;
  orderNumber: string;
}

/**
 * Full Order model
 * Represents populated API response
 */
export interface Order extends OrderBase {
  customer: CustomerBase;
  seller?: SellerBase;

  items: OrderItem[];

  deliveryAddress?: OrderAddressSnapshot;

  totals?: OrderTotals;

  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;

  createdAt: string;
  updatedAt: string;
}
