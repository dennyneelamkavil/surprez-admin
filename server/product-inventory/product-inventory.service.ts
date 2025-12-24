import "server-only";
import { connectDB } from "@/server/db";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { ProductModel } from "@/server/models/product.model";
import { mapProductInventory } from "@/server/product-inventory/product-inventory.mapper";
import type {
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
} from "@/server/product-inventory/product-inventory.validation";

/* ================= CREATE ================= */
export async function createProductInventory(
  input: CreateProductInventoryInput
) {
  await connectDB();

  const productExists = await ProductModel.exists({
    _id: input.product,
  });
  if (!productExists) throw new Error("Product not found");

  const skuExists = await ProductInventoryModel.findOne({
    sku: input.sku,
  });
  if (skuExists) throw new Error("SKU already exists");

  const inventory = await ProductInventoryModel.create({
    ...input,
    isActive: input.isActive ?? true,
  });

  return mapProductInventory(await inventory.populate("product"));
}

/* ================= LIST ================= */
export async function listProductInventories(params?: { productId?: string }) {
  await connectDB();

  const query: any = {};
  if (params?.productId) query.product = params.productId;

  const items = await ProductInventoryModel.find(query)
    .populate("product")
    .sort({ createdAt: -1 })
    .lean();

  return items.map(mapProductInventory);
}

/* ================= GET ================= */
export async function getProductInventoryById(id: string) {
  await connectDB();

  const inventory = await ProductInventoryModel.findById(id)
    .populate("product")
    .lean();

  if (!inventory) throw new Error("Inventory not found");
  return mapProductInventory(inventory);
}

/* ================= UPDATE ================= */
export async function updateProductInventory(
  id: string,
  input: UpdateProductInventoryInput
) {
  await connectDB();

  const inventory = await ProductInventoryModel.findByIdAndUpdate(id, input, {
    new: true,
  }).populate("product");

  if (!inventory) throw new Error("Inventory not found");
  return mapProductInventory(inventory);
}

/* ================= SOFT DELETE ================= */
export async function deleteProductInventory(id: string) {
  await connectDB();

  const inventory = await ProductInventoryModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!inventory) throw new Error("Inventory not found");
  return { success: true };
}
