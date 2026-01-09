import "server-only";

import { connectDB } from "@/server/db";
import { ProductModel } from "@/server/models/product.model";
import { CategoryModel } from "@/server/models/category.model";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { PageSeoModel } from "@/server/models/page-seo.model";

import { mapSeo } from "./seo.mapper";
import type { ResolvedSeo } from "./seo.types";

type ResolveSeoInput =
  | { type: "page"; pageKey: string }
  | { type: "product"; slug: string }
  | { type: "category"; slug: string }
  | { type: "subcategory"; slug: string };

export async function resolveSeo(
  input: ResolveSeoInput
): Promise<ResolvedSeo | null> {
  await connectDB();

  switch (input.type) {
    /* ================= STATIC / CMS PAGES ================= */
    case "page": {
      const page = await PageSeoModel.findOne({
        pageKey: input.pageKey,
        isActive: true,
      }).lean();

      return page?.seo ?? null;
    }

    /* ================= PRODUCT ================= */
    case "product": {
      const product = await ProductModel.findOne({
        slug: input.slug,
        isActive: true,
      }).lean();

      if (!product) return null;

      return mapSeo({
        seo: product.seo,
        fallback: {
          title: product.name,
          description: product.description,
          imageUrl: product.coverImage?.url,
          slug: product.slug,
          canonicalBase: "/products",
        },
      });
    }

    /* ================= CATEGORY ================= */
    case "category": {
      const category = await CategoryModel.findOne({
        slug: input.slug,
        isActive: true,
      }).lean();

      if (!category) return null;

      return mapSeo({
        seo: category.seo,
        fallback: {
          title: category.name,
          description: category.description,
          imageUrl: category.image?.url,
          slug: category.slug,
          canonicalBase: "/categories",
        },
      });
    }

    /* ================= SUBCATEGORY ================= */
    case "subcategory": {
      const subCategory = await SubCategoryModel.findOne({
        slug: input.slug,
        isActive: true,
      }).lean();

      if (!subCategory) return null;

      return mapSeo({
        seo: subCategory.seo,
        fallback: {
          title: subCategory.name,
          description: subCategory.description,
          imageUrl: subCategory.image?.url,
          slug: subCategory.slug,
          canonicalBase: "/subcategories",
        },
      });
    }
  }
}
