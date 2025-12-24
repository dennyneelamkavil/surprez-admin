import "server-only";
import { z } from "zod";

export const CreateProductInventorySchema = z.object({
  product: z.string(),
  sku: z.string().min(3),
  price: z.object({
    mrp: z.number().positive(),
    sellingPrice: z.number().positive(),
  }),
  stock: z.number().int().min(0),
  attributes: z.record(z.string(), z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const UpdateProductInventorySchema = z.object({
  sku: z.string().min(3).optional(),
  price: z
    .object({
      mrp: z.number().positive(),
      sellingPrice: z.number().positive(),
    })
    .optional(),
  stock: z.number().int().min(0).optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductInventoryInput = z.infer<
  typeof CreateProductInventorySchema
>;
export type UpdateProductInventoryInput = z.infer<
  typeof UpdateProductInventorySchema
>;
