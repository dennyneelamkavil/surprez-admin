import "server-only";

import { connectDB } from "@/server/db";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { CategoryModel } from "@/server/models/category.model";
import { ProductModel } from "@/server/models/product.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { AppError } from "@/server/errors/AppError";

import {
  mapSubCategoryDetail,
  mapSubCategoryForCustomerList,
} from "./subcategory.mapper";
import { mapProductForCustomerList } from "../product/product.mapper";

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

export async function getCustomerSubCategoryDetail(
  slug: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: "price" | "rating" | "createdAt";
    sortDir?: "asc" | "desc";
  },
) {
  await connectDB();

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const subcategory = await SubCategoryModel.findOne({
    slug,
    isActive: true,
  })
    .populate("category")
    .lean();

  if (!subcategory) {
    throw new AppError("SubCategory not found", 404);
  }

  const sortStage: any = {};
  if (params?.sortBy === "price") {
    sortStage.minSellingPrice = params.sortDir === "asc" ? 1 : -1;
  } else if (params?.sortBy === "rating") {
    sortStage["rating.average"] = params.sortDir === "asc" ? 1 : -1;
  } else {
    sortStage.createdAt = params?.sortDir === "asc" ? 1 : -1;
  }

  const match = {
    isActive: true,
    subcategories: subcategory._id,
  };

  const pipeline = [
    { $match: match },

    {
      $lookup: {
        from: ProductInventoryModel.collection.name,
        localField: "_id",
        foreignField: "product",
        as: "inventories",
      },
    },

    {
      $addFields: {
        minMrp: { $min: "$inventories.price.mrp" },
        minSellingPrice: { $min: "$inventories.price.sellingPrice" },
        totalStock: { $sum: "$inventories.stock" },
      },
    },

    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },
  ];

  const [products, total] = await Promise.all([
    ProductModel.aggregate(pipeline),
    ProductModel.countDocuments(match),
  ]);

  return {
    ...mapSubCategoryDetail(subcategory),

    products: products.map(mapProductForCustomerList),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },

    sort: {
      by: params?.sortBy ?? "createdAt",
      dir: params?.sortDir ?? "desc",
    },
  };
}
