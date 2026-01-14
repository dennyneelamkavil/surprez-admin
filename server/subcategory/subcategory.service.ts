import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { ProductModel } from "@/server/models/product.model";

import { mapSubCategory } from "@/server/subcategory/subcategory.mapper";
import type {
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from "@/server/subcategory/subcategory.validation";

import { generateUniqueSubCategorySlug } from "@/server/utils/slug.util";
import { buildSortSpec } from "@/server/utils/build-sort-spec";
import {
  deleteFromCloudinary,
  moveMediaToFinalFolder,
} from "@/server/media/media.provider";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createSubCategory(input: CreateSubCategoryInput) {
  await connectDB();

  const categoryExists = await CategoryModel.exists({
    _id: input.category,
  });
  if (!categoryExists) {
    throw new AppError("Category not found", 404);
  }

  const slug = await generateUniqueSubCategorySlug(input.name);

  const image = input.image?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.image, "subcategories")
    : input.image;

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const subCategory = await SubCategoryModel.create({
    name: input.name,
    slug,
    image,
    category: input.category,
    description: input.description,
    seo: input.seo,
    isActive: input.isActive ?? true,
  });

  return mapSubCategory(await subCategory.populate("category"));
}

/* ================= LIST ================= */
export async function listSubCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  categoryId?: string;
  isActive?: string;
}) {
  await connectDB();

  if (params?.all) {
    const subcategories = await SubCategoryModel.find({ isActive: true })
      .populate("category")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .lean();

    return {
      data: subcategories.map(mapSubCategory),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "subcategory",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  if (params?.categoryId) {
    query.category = params.categoryId;
  }

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
  }

  const [subcategories, total] = await Promise.all([
    SubCategoryModel.find(query)
      .populate("category")
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    SubCategoryModel.countDocuments(query),
  ]);

  return {
    data: subcategories.map(mapSubCategory),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */
export async function getSubCategoryById(id: string) {
  await connectDB();

  const subCategory = await SubCategoryModel.findById(id)
    .populate("category")
    .lean();

  if (!subCategory) {
    throw new AppError("SubCategory not found", 404);
  }
  return mapSubCategory(subCategory);
}

/* ================= UPDATE ================= */
export async function updateSubCategory(
  id: string,
  input: UpdateSubCategoryInput
) {
  await connectDB();

  const existing = await SubCategoryModel.findById(id);
  if (!existing) {
    throw new AppError("SubCategory not found", 404);
  }

  if (input.category) {
    const categoryExists = await CategoryModel.exists({
      _id: input.category,
    });
    if (!categoryExists) {
      throw new AppError("Category not found", 404);
    }
  }

  const image = input.image?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.image, "subcategories")
    : input.image;

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const updateData: any = { ...input, image };

  if (input.name) {
    updateData.slug = await generateUniqueSubCategorySlug(input.name, id);
  }

  const updated = await SubCategoryModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("category");

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

  return mapSubCategory(updated);
}

/* ================= DELETE ================= */
export async function deleteSubCategory(id: string) {
  await connectDB();

  const isUsed = await ProductModel.exists({
    subcategories: id,
  });
  if (isUsed) {
    throw new AppError(
      "Cannot delete subcategory: products are linked to this subcategory",
      409
    );
  }

  const subCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    throw new AppError("SubCategory not found", 404);
  }

  // Delete subcategory image
  if (subCategory?.image?.publicId) {
    await deleteFromCloudinary(
      subCategory.image.publicId,
      subCategory.image.resourceType
    );
  }
  if (subCategory.seo?.ogImage?.publicId) {
    await deleteFromCloudinary(
      subCategory.seo.ogImage.publicId,
      subCategory.seo.ogImage.resourceType
    );
  }

  return { success: true };
}
