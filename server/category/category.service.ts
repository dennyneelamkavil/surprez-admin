import "server-only";
import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { mapCategory } from "@/server/category/category.mapper";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/server/category/category.validation";
import { generateUniqueCategorySlug } from "@/server/utils/slug.util";
import { deleteFromCloudinary } from "@/server/media/media.provider";

/* ================= CREATE ================= */
export async function createCategory(input: CreateCategoryInput) {
  await connectDB();

  const slug = await generateUniqueCategorySlug(input.name);

  const category = await CategoryModel.create({
    name: input.name,
    slug,
    image: input.image,
    description: input.description,
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
}) {
  await connectDB();

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const query: any = {};

  if (params?.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  if (params?.all) {
    const categories = await CategoryModel.find(query).sort({ key: 1 }).lean();

    return {
      categories: categories.map(mapCategory),
      pagination: null,
    };
  }

  const [categories, total] = await Promise.all([
    CategoryModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CategoryModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    categories: categories.map(mapCategory),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/* ================= GET ================= */
export async function getCategoryById(id: string) {
  await connectDB();

  const category = await CategoryModel.findById(id).lean();
  if (!category) throw new Error("Category not found");

  return mapCategory(category);
}

/* ================= UPDATE ================= */
export async function updateCategory(id: string, input: UpdateCategoryInput) {
  await connectDB();

  const existing = await CategoryModel.findById(id);
  if (!existing) throw new Error("Category not found");

  const updateData: any = { ...input };

  if (input.name) {
    updateData.slug = await generateUniqueCategorySlug(input.name, id);
  }

  const updated = await CategoryModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (input.image && existing.image?.publicId) {
    await deleteFromCloudinary(
      existing.image.publicId,
      existing.image.resourceType
    );
  }

  return mapCategory(updated);
}

/* ================= SOFT DELETE ================= */
export async function deleteCategory(id: string) {
  await connectDB();

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!category) throw new Error("Category not found");

  if (category?.image?.publicId) {
    await deleteFromCloudinary(
      category.image.publicId,
      category.image.resourceType
    );
  }

  return { success: true };
}
