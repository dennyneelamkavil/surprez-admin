import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { SubCategoryModel } from "@/server/models/subcategory.model";

import { mapCategory } from "@/server/category/category.mapper";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/server/category/category.validation";

import { generateUniqueCategorySlug } from "@/server/utils/slug.util";
import { buildSortSpec } from "@/server/utils/build-sort-spec";
import {
  deleteFromCloudinary,
  moveMediaToFinalFolder,
} from "@/server/media/media.provider";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createCategory(input: CreateCategoryInput) {
  await connectDB();

  const slug = await generateUniqueCategorySlug(input.name);

  const image = input.image?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.image, "categories")
    : input.image;

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const category = await CategoryModel.create({
    name: input.name,
    slug,
    image,
    description: input.description,
    seo: input.seo,
    isActive: input.isActive ?? true,
  });

  return mapCategory(category);
}

/* ================= LIST ================= */
export async function listCategories(params?: {
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
    const categories = await CategoryModel.find({ isActive: true })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .lean();

    return {
      data: categories.map(mapCategory),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "category",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
  }

  const [categories, total] = await Promise.all([
    CategoryModel.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    CategoryModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: categories.map(mapCategory),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */
export async function getCategoryById(id: string) {
  await connectDB();

  const category = await CategoryModel.findById(id).lean();
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return mapCategory(category);
}

/* ================= UPDATE ================= */
export async function updateCategory(id: string, input: UpdateCategoryInput) {
  await connectDB();

  const existing = await CategoryModel.findById(id);
  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  const image = input.image?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.image, "categories")
    : input.image;

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const updateData: any = { ...input, image };

  if (input.name) {
    updateData.slug = await generateUniqueCategorySlug(input.name, id);
  }

  const updated = await CategoryModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (
    input.image &&
    existing.image?.publicId &&
    input.image.publicId !== existing.image.publicId
  ) {
    await deleteFromCloudinary(
      existing.image.publicId,
      existing.image.resourceType
    );
  }

  if (
    input.seo?.ogImage &&
    existing.seo?.ogImage?.publicId &&
    input.seo.ogImage.publicId !== existing.seo.ogImage.publicId
  ) {
    await deleteFromCloudinary(
      existing.seo.ogImage.publicId,
      existing.seo.ogImage.resourceType
    );
  }

  return mapCategory(updated);
}

/* ================= DELETE ================= */
export async function deleteCategory(id: string) {
  await connectDB();

  const isUsed = await SubCategoryModel.exists({
    category: id,
  });
  if (isUsed) {
    throw new AppError(
      "Cannot delete category: subcategories are linked to this category",
      409
    );
  }

  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    {
      throw new AppError("Category not found", 404);
    }
  }

  // Delete category image
  if (category?.image?.publicId) {
    await deleteFromCloudinary(
      category.image.publicId,
      category.image.resourceType
    );
  }
  if (category.seo?.ogImage?.publicId) {
    await deleteFromCloudinary(
      category.seo.ogImage.publicId,
      category.seo.ogImage.resourceType
    );
  }

  return { success: true };
}
