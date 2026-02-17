import "server-only";

import { connectDB } from "@/server/db";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { CategoryModel } from "@/server/models/category.model";
import { mapSubCategoryForCustomerList } from "./subcategory.mapper";

export async function listCustomerSubCategories(params: {
  categorySlug?: string;
}) {
  await connectDB();

  const match: any = {
    isActive: true,
  };

  if (params.categorySlug) {
    const category = await CategoryModel.findOne({
      slug: params.categorySlug,
      isActive: true,
    }).lean();

    if (category) {
      match.category = category._id;
    }
  }

  const subcategories = await SubCategoryModel.find(match)
    .sort({ createdAt: -1 })
    .lean();

  return {
    data: subcategories.map(mapSubCategoryForCustomerList),
  };
}
