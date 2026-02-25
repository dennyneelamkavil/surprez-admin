import "server-only";

import { connectDB } from "@/server/db";
import { CustomerModel } from "@/server/models/customer.model";

import { mapCustomer } from "@/server/customer-management/customer.mapper";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/server/customer-management/customer.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */

export async function createCustomer(input: CreateCustomerInput) {
  await connectDB();

  const existing = await CustomerModel.findOne({ phone: input.phone });
  if (existing) {
    throw new AppError("Customer with this phone already exists", 409);
  }

  const customer = await CustomerModel.create({
    ...input,
    isActive: input.isActive ?? true,
  });

  return mapCustomer(customer);
}

/* ================= LIST ================= */

export async function listCustomers(params?: {
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
    const customers = await CustomerModel.find().sort({ createdAt: -1 }).lean();

    return {
      data: customers.map(mapCustomer),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "customer",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.$or = [
      { phone: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
      { fullName: { $regex: params.search, $options: "i" } },
    ];
  }

  if (params?.isActive === "true") {
    query.isActive = true;
  } else if (params?.isActive === "false") {
    query.isActive = false;
  }

  const [customers, total] = await Promise.all([
    CustomerModel.find(query).sort(sortSpec).skip(skip).limit(limit).lean(),
    CustomerModel.countDocuments(query),
  ]);

  return {
    data: customers.map(mapCustomer),
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

export async function getCustomerById(id: string) {
  await connectDB();

  const customer = await CustomerModel.findById(id).lean();

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return mapCustomer(customer);
}

/* ================= UPDATE ================= */

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  await connectDB();

  const existing = await CustomerModel.findById(id);
  if (!existing) {
    throw new AppError("Customer not found", 404);
  }

  const updated = await CustomerModel.findByIdAndUpdate(id, input, {
    new: true,
  }).lean();

  return mapCustomer(updated);
}

/* ================= DELETE ================= */

export async function deleteCustomer(id: string) {
  await connectDB();

  const customer = await CustomerModel.findByIdAndDelete(id);

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return { success: true };
}
