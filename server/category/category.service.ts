import "server-only";
import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { mapCategory } from "@/server/category/category.mapper";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/server/category/category.validation";

/* ================= CREATE ================= */
export async function createCategory(input: CreateCategoryInput) {
  await connectDB();

  const exists = await CategoryModel.findOne({ slug: input.slug });
  if (exists) throw new Error("Category with this slug already exists");

  const category = await CategoryModel.create({
    name: input.name,
    slug: input.slug,
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

  const category = await CategoryModel.findByIdAndUpdate(id, input, {
    new: true,
  });

  if (!category) throw new Error("Category not found");
  return mapCategory(category);
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
  return { success: true };
}
