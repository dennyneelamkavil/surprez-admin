import "server-only";

import { connectDB } from "@/server/db";
import { ProductModel } from "@/server/models/product.model";
import { ProductComplianceModel } from "@/server/models/product-compliance.model";
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
import {
  deleteFromCloudinary,
  finalizeMediaArray,
  moveMediaToFinalFolder,
} from "@/server/media/media.provider";
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

  const coverImage = input.coverImage?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.coverImage, "products/covers")
    : input.coverImage;
  const images = await finalizeMediaArray(input.images, "products/images");
  const videos = await finalizeMediaArray(input.videos, "products/videos");

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const { compliance, ...productInput } = input;

  const product = await ProductModel.create({
    ...productInput,
    coverImage,
    images,
    videos,
    slug,
    isActive: input.isActive ?? true,
    isFeatured: input.isFeatured ?? false,
  });

  // create compliance if provided
  if (compliance) {
    await ProductComplianceModel.create({
      product: product._id,
      ...compliance,
    });
  }

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
  isActive?: string;
}) {
  await connectDB();

  if (params?.all) {
    const products = await ProductModel.find({ isActive: true })
      .populate("subcategories")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .lean();

    return {
      data: products.map(mapProduct),
      pagination: null,
    };
  }

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

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
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

  const compliance = await ProductComplianceModel.findOne({
    product: product._id,
  }).lean();

  return mapProduct({
    ...product,
    compliance,
  });
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

  const coverImage = input.coverImage?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.coverImage, "products/covers")
    : input.coverImage;
  const images = await finalizeMediaArray(input.images, "products/images");
  const videos = await finalizeMediaArray(input.videos, "products/videos");

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const { compliance, ...updateInput } = input;

  const updateData: any = { ...updateInput, coverImage, images, videos };

  if (input.name) {
    updateData.slug = await generateUniqueProductSlug(input.name, id);
  }

  const updated = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("subcategories");

  if (compliance) {
    await ProductComplianceModel.findOneAndUpdate(
      { product: id },
      {
        product: id,
        ...compliance,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  if (
    input.coverImage &&
    existing.coverImage?.publicId &&
    input.coverImage.publicId !== existing.coverImage.publicId
  ) {
    await deleteFromCloudinary(
      existing.coverImage.publicId,
      existing.coverImage.resourceType,
    );
  }

  if (
    input.seo?.ogImage &&
    existing.seo?.ogImage?.publicId &&
    input.seo.ogImage.publicId !== existing.seo.ogImage.publicId
  ) {
    await deleteFromCloudinary(
      existing.seo.ogImage.publicId,
      existing.seo.ogImage.resourceType,
    );
  }

  if (input.images) {
    const oldIds = existing.images.map((i: { publicId: string }) => i.publicId);
    const newIds = images.map((i) => i.publicId);

    const removed = oldIds.filter((id: string) => !newIds.includes(id));

    for (const publicId of removed) {
      await deleteFromCloudinary(publicId, "image");
    }
  }

  if (input.videos) {
    const oldIds = existing.videos.map((v: { publicId: string }) => v.publicId);
    const newIds = videos.map((v) => v.publicId);

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
      409,
    );
  }
  const hasReviews = await ReviewModel.exists?.({
    product: id,
  });
  if (hasReviews) {
    throw new AppError(
      "Cannot delete product: reviews exist for this product",
      409,
    );
  }

  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await ProductComplianceModel.deleteOne({ product: id });

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
      product.coverImage.resourceType,
    );
  }
  if (product.seo?.ogImage?.publicId) {
    await deleteFromCloudinary(
      product.seo.ogImage.publicId,
      product.seo.ogImage.resourceType,
    );
  }

  return { success: true };
}
