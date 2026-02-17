import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { mapCategoryForCustomerList } from "./category.mapper";

export async function listCustomerCategories() {
  await connectDB();

  const categories = await CategoryModel.find({
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    data: categories.map(mapCategoryForCustomerList),
  };
}
