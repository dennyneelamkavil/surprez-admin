import "server-only";
import { connectDB } from "@/server/db";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { CategoryModel } from "@/server/models/category.model";
import { mapSubCategory } from "@/server/subcategory/subcategory.mapper";
import type {
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from "@/server/subcategory/subcategory.validation";
import { generateUniqueSubCategorySlug } from "@/server/utils/slug.util";

/* ================= CREATE ================= */
export async function createSubCategory(input: CreateSubCategoryInput) {
  await connectDB();

  const categoryExists = await CategoryModel.exists({
    _id: input.category,
  });
  if (!categoryExists) throw new Error("Category not found");

  const slug = await generateUniqueSubCategorySlug(input.name);

  const subCategory = await SubCategoryModel.create({
    name: input.name,
    slug,
    image: input.image,
    category: input.category,
    description: input.description,
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
  categoryId?: string;
}) {
  await connectDB();

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const query: any = {};

  if (params?.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  if (params?.categoryId) {
    query.category = params.categoryId;
  }

  if (params?.all) {
    const subcategories = await SubCategoryModel.find(query)
      .populate("category")
      .sort({ key: 1 })
      .lean();

    return {
      subcategories: subcategories.map(mapSubCategory),
      pagination: null,
    };
  }

  const [subcategories, total] = await Promise.all([
    SubCategoryModel.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SubCategoryModel.countDocuments(query),
  ]);

  return {
    subcategories: subcategories.map(mapSubCategory),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/* ================= GET ================= */
export async function getSubCategoryById(id: string) {
  await connectDB();

  const subCategory = await SubCategoryModel.findById(id)
    .populate("category")
    .lean();

  if (!subCategory) throw new Error("SubCategory not found");
  return mapSubCategory(subCategory);
}

/* ================= UPDATE ================= */
export async function updateSubCategory(
  id: string,
  input: UpdateSubCategoryInput
) {
  await connectDB();

  if (input.category) {
    const categoryExists = await CategoryModel.exists({
      _id: input.category,
    });
    if (!categoryExists) throw new Error("Category not found");
  }

  const updateData: any = { ...input };

  if (input.name) {
    updateData.slug = await generateUniqueSubCategorySlug(input.name, id);
  }

  const subCategory = await SubCategoryModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("category");

  if (!subCategory) throw new Error("SubCategory not found");
  return mapSubCategory(subCategory);
}

/* ================= SOFT DELETE ================= */
export async function deleteSubCategory(id: string) {
  await connectDB();

  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!subCategory) throw new Error("SubCategory not found");
  return { success: true };
}
