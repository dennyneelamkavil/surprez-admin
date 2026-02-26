import "server-only";
import { z } from "zod";

export const AddToCartSchema = z.object({
  inventoryId: z.string().min(1),
  quantity: z.number().min(1),
});

export const UpdateCartItemSchema = z.object({
  inventoryId: z.string().min(1),
  quantity: z.number().min(1),
});

export const RemoveCartItemSchema = z.object({
  inventoryId: z.string().min(1),
});
