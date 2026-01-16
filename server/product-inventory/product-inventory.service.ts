import "server-only";

import { connectDB } from "@/server/db";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { ProductModel } from "@/server/models/product.model";

import { mapProductInventory } from "@/server/product-inventory/product-inventory.mapper";
import type {
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
} from "@/server/product-inventory/product-inventory.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createProductInventory(
  input: CreateProductInventoryInput
) {
  await connectDB();

  const productExists = await ProductModel.exists({
    _id: input.product,
  });
  if (!productExists) {
    throw new AppError("Product not found", 404);
  }

  const skuExists = await ProductInventoryModel.findOne({
    sku: input.sku,
  });
  if (skuExists) {
    throw new AppError("SKU already exists", 409);
  }

  const inventory = await ProductInventoryModel.create({
    ...input,
    isActive: input.isActive ?? true,
  });

  return mapProductInventory(await inventory.populate("product"));
}

/* ================= LIST ================= */
export async function listProductInventories(params?: {
  productId?: string;
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  isActive?: string;
}) {
  await connectDB();

  if (params?.all) {
    const products = await ProductInventoryModel.find({
      product: params.productId,
      isActive: true,
    })
      .populate("product")
      .collation({ locale: "en", strength: 2 })
      .sort({ sku: 1 })
      .lean();

    return {
      data: products.map(mapProductInventory),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "inventory",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.productId) query.product = params.productId;

  if (params?.search) {
    const search = params.search.trim();
    const num = Number(search);

    query.$or = [{ sku: { $regex: search, $options: "i" } }];

    if (!Number.isNaN(num)) {
      query.$or.push({ "price.mrp": num }, { "price.sellingPrice": num });
    }
  }

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
  }

  const [inventories, total] = await Promise.all([
    ProductInventoryModel.find(query)
      .populate("product")
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductInventoryModel.countDocuments(query),
  ]);

  return {
    data: inventories.map(mapProductInventory),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */
export async function getProductInventoryById(id: string) {
  await connectDB();

  const inventory = await ProductInventoryModel.findById(id)
    .populate("product")
    .lean();

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }
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

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }
  return mapProductInventory(inventory);
}

/* ================= DELETE ================= */
export async function deleteProductInventory(id: string) {
  await connectDB();

  const inventory = await ProductInventoryModel.findByIdAndDelete(id);

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }
  return { success: true };
}
