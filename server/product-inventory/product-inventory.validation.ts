import "server-only";
import { z } from "zod";

const PriceValidation = z.object({
  mrp: z.number().min(0),
  sellingPrice: z.number().min(0),
  currency: z.string().min(1).optional(), // default handled server-side
});

const DimensionsValidation = z.object({
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  unit: z.string().optional(), // cm
});

const WeightValidation = z.object({
  value: z.number().positive().optional(),
  unit: z.string().optional(), // kg
});

const ShippingValidation = z.object({
  dimensions: DimensionsValidation.optional(),
  weight: WeightValidation.optional(),
  handlingTime: z.number().int().min(0).optional(), // days
  shippingTemplate: z.string().optional(),
});

export const CreateProductInventorySchema = z.object({
  product: z.string(),
  sku: z.string().min(3),
  barcode: z.string().optional(),
  price: PriceValidation,
  stock: z.number().int().min(0),
  attributes: z.record(z.string(), z.string()).optional(),
  shipping: ShippingValidation.optional(),
  isActive: z.boolean().optional(),
});

export const UpdateProductInventorySchema = z.object({
  sku: z.string().min(3).optional(),
  barcode: z.string().optional(),
  price: PriceValidation.optional(),
  stock: z.number().int().min(0).optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  shipping: ShippingValidation.optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductInventoryInput = z.infer<
  typeof CreateProductInventorySchema
>;
export type UpdateProductInventoryInput = z.infer<
  typeof UpdateProductInventorySchema
>;
