import "server-only";

import { connectDB } from "@/server/db";
import { ProductModel } from "@/server/models/product.model";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { ReviewModel } from "@/server/models/review.model";

import { mapProduct } from "@/server/product/product.mapper";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/server/product/product.validation";

import { generateUniqueProductSlug } from "@/server/utils/slug.util";
import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { deleteFromCloudinary } from "@/server/media/media.provider";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createProduct(input: CreateProductInput) {
  await connectDB();

  const slug = await generateUniqueProductSlug(input.name);

  if (input.subcategories?.length) {
    const count = await SubCategoryModel.countDocuments({
      _id: { $in: input.subcategories },
    });
    if (count !== input.subcategories.length) {
      throw new AppError("One or more subcategories are invalid", 400);
    }
  }

  const product = await ProductModel.create({
    ...input,
    slug,
    isActive: input.isActive ?? true,
    isFeatured: input.isFeatured ?? false,
  });

  return mapProduct(await product.populate("subcategories"));
}

/* ================= LIST ================= */
export async function listProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  subcategoryId?: string;
  isFeatured?: string;
}) {
  await connectDB();

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "product",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  if (params?.subcategoryId) {
    query.subcategories = params.subcategoryId;
  }

  if (params?.isFeatured === "true") {
    query.isFeatured = true;
  } else if (params?.isFeatured === "false") {
    query.isFeatured = false;
  }

  if (params?.all) {
    const products = await ProductModel.find(query)
      .populate("subcategories")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .lean();

    return {
      data: products.map(mapProduct),
      pagination: null,
    };
  }

  const [products, total] = await Promise.all([
    ProductModel.find(query)
      .populate("subcategories")
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(query),
  ]);

  return {
    data: products.map(mapProduct),
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
export async function getProductById(id: string) {
  await connectDB();

  const product = await ProductModel.findById(id)
    .populate("subcategories")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return mapProduct(product);
}

/* ================= UPDATE ================= */
export async function updateProduct(id: string, input: UpdateProductInput) {
  await connectDB();

  const existing = await ProductModel.findById(id);
  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  if (input.subcategories?.length) {
    const count = await SubCategoryModel.countDocuments({
      _id: { $in: input.subcategories },
    });
    if (count !== input.subcategories.length) {
      throw new AppError("One or more subcategories are invalid", 400);
    }
  }

  const updateData: any = { ...input };

  if (input.name) {
    updateData.slug = await generateUniqueProductSlug(input.name, id);
  }

  const updated = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("subcategories");

  if (input.coverImage && existing.coverImage?.publicId) {
    await deleteFromCloudinary(
      existing.coverImage.publicId,
      existing.coverImage.resourceType
    );
  }

  if (input.images) {
    const oldIds = existing.images.map((i: { publicId: string }) => i.publicId);
    const newIds = input.images.map((i: { publicId: string }) => i.publicId);

    const removed = oldIds.filter((id: string) => !newIds.includes(id));

    for (const publicId of removed) {
      await deleteFromCloudinary(publicId, "image");
    }
  }

  if (input.videos) {
    const oldIds = existing.videos.map((v: { publicId: string }) => v.publicId);
    const newIds = input.videos.map((v: { publicId: string }) => v.publicId);

    const removed = oldIds.filter((id: string) => !newIds.includes(id));

    for (const publicId of removed) {
      await deleteFromCloudinary(publicId, "video");
    }
  }

  return mapProduct(updated);
}

/* ================= DELETE ================= */
export async function deleteProduct(id: string) {
  await connectDB();

  const hasInventory = await ProductInventoryModel.exists({
    product: id,
  });
  if (hasInventory) {
    throw new AppError(
      "Cannot delete product: inventories exist for this product",
      409
    );
  }
  const hasReviews = await ReviewModel.exists?.({
    product: id,
  });
  if (hasReviews) {
    throw new AppError(
      "Cannot delete product: reviews exist for this product",
      409
    );
  }

  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // delete images, videos and cover image from cloudinary
  for (const img of product.images ?? []) {
    await deleteFromCloudinary(img.publicId, "image");
  }
  for (const vid of product.videos ?? []) {
    await deleteFromCloudinary(vid.publicId, "video");
  }
  if (product.coverImage?.publicId) {
    await deleteFromCloudinary(
      product.coverImage.publicId,
      product.coverImage.resourceType
    );
  }

  return { success: true };
}
