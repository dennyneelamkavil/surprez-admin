import "server-only";

import { connectDB } from "@/server/db";
import { ProductModel } from "@/server/models/product.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { AppError } from "@/server/errors/AppError";

import { mapProductDetail } from "./product-detail.mapper";

export async function getCustomerProductDetail(slug: string) {
  await connectDB();

  const product = await ProductModel.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const inventories = await ProductInventoryModel.find({
    product: product._id,
    isActive: true,
  })
    .sort({ "price.sellingPrice": 1 })
    .lean();

  return mapProductDetail(product, inventories);
}
