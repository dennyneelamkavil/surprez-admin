import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { ProductModel } from "@/server/models/product.model";

import {
  mapBannerSection,
  mapCategoryForHome,
  mapProductForHome,
} from "./home.mapper";

export async function getHomeData() {
  await connectDB();

  // Categories
  const categories = await CategoryModel.find({
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Featured products
  const featuredProducts = await ProductModel.find({
    isActive: true,
    isFeatured: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // New arrivals
  const newArrivals = await ProductModel.find({
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

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
