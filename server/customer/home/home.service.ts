import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { ProductModel } from "@/server/models/product.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";

import {
  mapBannerSection,
  mapCategoryForHome,
  mapProductForHome,
} from "./home.mapper";

export async function getHomeData() {
  await connectDB();

  /* ================= CATEGORIES ================= */
  const categories = await CategoryModel.find({
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  /* ================= FEATURED PRODUCTS ================= */
  const featuredProducts = await ProductModel.aggregate([
    {
      $match: {
        isActive: true,
        isFeatured: true,
      },
    },
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
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
  ]);

  /* ================= NEW ARRIVALS ================= */
  const newArrivals = await ProductModel.aggregate([
    {
      $match: {
        isActive: true,
      },
    },
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
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
  ]);

  return {
    categories: categories.map(mapCategoryForHome),
    sections: [
      mapBannerSection(),
      {
        key: "featured-products",
        title: "Featured Products",
        type: "product",
        items: featuredProducts.map(mapProductForHome),
      },
      {
        key: "new-arrivals",
        title: "New Arrivals",
        type: "product",
        items: newArrivals.map(mapProductForHome),
      },
    ],
  };
}
