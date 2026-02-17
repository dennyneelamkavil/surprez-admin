import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { AppError } from "@/server/errors/AppError";

import { mapCategoryDetail } from "./category.mapper";

export async function getCustomerCategoryDetail(slug: string) {
  await connectDB();

  const category = await CategoryModel.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const subcategories = await SubCategoryModel.find({
    category: category._id,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return mapCategoryDetail(category, subcategories);
}
