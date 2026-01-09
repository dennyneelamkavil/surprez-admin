import "server-only";

import { connectDB } from "@/server/db";
import { PageSeoModel } from "@/server/models/page-seo.model";

import { mapPageSeo } from "@/server/page-seo/page-seo.mapper";
import {
  CreatePageSeoInput,
  UpdatePageSeoInput,
} from "@/server/page-seo/page-seo.validation";

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
export async function listPageSeos() {
  await connectDB();

  const pages = await PageSeoModel.find().sort({ pageKey: 1 }).lean();

  return pages.map(mapPageSeo);
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
