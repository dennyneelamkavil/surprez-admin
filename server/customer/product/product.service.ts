import "server-only";

import { connectDB } from "@/server/db";
import { ProductModel } from "@/server/models/product.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { CategoryModel } from "@/server/models/category.model";
import { mapProductForCustomerList } from "./product.mapper";

export async function listCustomerProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  sortBy?: "price" | "createdAt" | "rating";
  sortDir?: "asc" | "desc";
}) {
  await connectDB();

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const match: any = {
    isActive: true,
  };

  if (params.search) {
    match.name = { $regex: params.search, $options: "i" };
  }

  if (params.categorySlug) {
    const category = await CategoryModel.findOne({
      slug: params.categorySlug,
      isActive: true,
    }).lean();

    if (category) {
      match.subcategories = category._id;
    }
  }

  const sortStage: any = {};
  if (params.sortBy === "price") {
    sortStage.minSellingPrice = params.sortDir === "asc" ? 1 : -1;
  } else if (params.sortBy === "rating") {
    sortStage["rating.average"] = params.sortDir === "asc" ? 1 : -1;
  } else {
    sortStage.createdAt = params.sortDir === "asc" ? 1 : -1;
  }

  const pipeline = [
    { $match: match },

    // join inventories
    {
      $lookup: {
        from: ProductInventoryModel.collection.name,
        localField: "_id",
        foreignField: "product",
        as: "inventories",
      },
    },

    // compute price & stock
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
    data: products.map(mapProductForCustomerList),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    sort: {
      by: params.sortBy ?? "createdAt",
      dir: params.sortDir ?? "desc",
    },
  };
}
