import "server-only";

import { connectDB } from "@/server/db";
import { PageSeoModel } from "@/server/models/page-seo.model";

import { mapPageSeo } from "@/server/page-seo/page-seo.mapper";
import {
  CreatePageSeoInput,
  UpdatePageSeoInput,
} from "@/server/page-seo/page-seo.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";

import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createPageSeo(input: CreatePageSeoInput) {
  await connectDB();

  const exists = await PageSeoModel.exists({ pageKey: input.pageKey });
  if (exists) {
    throw new AppError("SEO already exists for this page", 409);
  }

  const pageSeo = await PageSeoModel.create({
    ...input,
    isActive: input.isActive ?? true,
  });

  return mapPageSeo(pageSeo);
}

/* ================= LIST ================= */
export async function listPageSeos(params?: {
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
    const pageSeos = await PageSeoModel.find({ isActive: true })
      .sort({ pageKey: 1 })
      .lean();

    return {
      data: pageSeos.map(mapPageSeo),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "pageseo",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.pageKey = { $regex: params.search, $options: "i" };
  }

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
  }

  const [pageSeos, total] = await Promise.all([
    PageSeoModel.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    PageSeoModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: pageSeos.map(mapPageSeo),
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

/* ================= GET (ADMIN) ================= */
export async function getPageSeoById(id: string) {
  await connectDB();

  const pageSeo = await PageSeoModel.findById(id).lean();
  if (!pageSeo) {
    throw new AppError("Page SEO not found", 404);
  }

  return mapPageSeo(pageSeo);
}

/* ================= GET (FRONTEND) ================= */
export async function getPageSeoByKey(pageKey: string) {
  await connectDB();

  const pageSeo = await PageSeoModel.findOne({
    pageKey,
    isActive: true,
  }).lean();

  return pageSeo?.seo ?? null;
}

/* ================= UPDATE ================= */
export async function updatePageSeo(id: string, input: UpdatePageSeoInput) {
  await connectDB();

  const updated = await PageSeoModel.findByIdAndUpdate(id, input, {
    new: true,
  }).lean();

  if (!updated) {
    throw new AppError("Page SEO not found", 404);
  }

  return mapPageSeo(updated);
}

/* ================= DELETE ================= */
export async function deletePageSeo(id: string) {
  await connectDB();

  const deleted = await PageSeoModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError("Page SEO not found", 404);
  }

  return { success: true };
}
