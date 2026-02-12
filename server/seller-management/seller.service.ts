import "server-only";

import bcrypt from "bcryptjs";

import { connectDB } from "@/server/db";
import { SellerModel } from "@/server/models/seller.model";

import { mapSeller } from "@/server/seller-management/seller.mapper";
import type {
  CreateSellerInput,
  UpdateSellerInput,
} from "@/server/seller-management/seller.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */

export async function createSeller(input: CreateSellerInput) {
  await connectDB();

  const existing = await SellerModel.findOne({ email: input.email });
  if (existing) {
    throw new AppError("Seller with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const seller = await SellerModel.create({
    ...input,
    passwordHash,
    isActive: input.isActive ?? true,
    status: input.status ?? "pending",
  });

  return mapSeller(seller);
}

/* ================= LIST ================= */

export async function listSellers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  status?: string;
  sellerType?: string;
  businessType?: string;
  isActive?: string;
}) {
  await connectDB();

  if (params?.all) {
    const sellers = await SellerModel.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ createdAt: -1 })
      .lean();

    return {
      data: sellers.map(mapSeller),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "seller",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.$or = [
      { businessName: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }

  if (params?.status) {
    query.status = params.status;
  }

  if (params?.sellerType) {
    query.sellerType = params.sellerType;
  }

  if (params?.businessType) {
    query.businessType = params.businessType;
  }

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
  }

  const [sellers, total] = await Promise.all([
    SellerModel.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    SellerModel.countDocuments(query),
  ]);

  return {
    data: sellers.map(mapSeller),
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

export async function getSellerById(id: string) {
  await connectDB();

  const seller = await SellerModel.findById(id).lean();

  if (!seller) {
    throw new AppError("Seller not found", 404);
  }

  return mapSeller(seller);
}

/* ================= UPDATE ================= */

export async function updateSeller(id: string, input: UpdateSellerInput) {
  await connectDB();

  const existing = await SellerModel.findById(id);
  if (!existing) {
    throw new AppError("Seller not found", 404);
  }

  const updateData: any = { ...input };

  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(input.password, 12);
  }

  if (input.status === "approved" && !existing.approvedAt) {
    updateData.approvedAt = new Date();
  }

  if (input.status !== "rejected") {
    updateData.rejectedReason = null;
  }

  const updated = await SellerModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  return mapSeller(updated);
}

/* ================= DELETE ================= */

export async function deleteSeller(id: string) {
  await connectDB();

  const seller = await SellerModel.findByIdAndDelete(id);

  if (!seller) {
    throw new AppError("Seller not found", 404);
  }

  return { success: true };
}
