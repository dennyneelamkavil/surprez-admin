import "server-only";

import { connectDB } from "@/server/db";
import { RoleModel } from "@/server/models/role.model";
import { UserModel } from "@/server/models/user.model";
import "@/server/models/permission.model";

import { mapRole } from "@/server/role/role.mapper";
import type {
  CreateRoleInput,
  UpdateRoleInput,
} from "@/server/role/role.validation";

import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createRole(input: CreateRoleInput) {
  await connectDB();

  const exists = await RoleModel.findOne({ name: input.name });
  if (exists) {
    throw new AppError("Role already exists", 409);
  }

  const role = await RoleModel.create({
    name: input.name,
    permissions: input.permissions ?? [],
    isSuperAdmin: input.isSuperAdmin ?? false,
  });

  return mapRole(await role.populate("permissions"));
}

/* ================= LIST ================= */
export async function listRoles(params: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
}) {
  await connectDB();

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const query: any = {};

  if (params.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  if (params?.all) {
    const roles = await RoleModel.find(query)
      .populate("permissions")
      .sort({ key: 1 })
      .lean();

    return {
      roles: roles.map(mapRole),
      pagination: null,
    };
  }

  const [roles, total] = await Promise.all([
    RoleModel.find(query)
      .populate("permissions")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RoleModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    roles: roles.map(mapRole),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/* ================= GET ================= */
export async function getRoleById(id: string) {
  await connectDB();

  const role = await RoleModel.findById(id).populate("permissions").lean();

  if (!role) {
    throw new AppError("Role not found", 404);
  }
  return mapRole(role);
}

/* ================= UPDATE ================= */
export async function updateRole(id: string, input: UpdateRoleInput) {
  await connectDB();

  const role = await RoleModel.findByIdAndUpdate(id, input, {
    new: true,
  }).populate("permissions");

  if (!role) {
    throw new AppError("Role not found", 404);
  }
  return mapRole(role);
}

/* ================= DELETE ================= */
export async function deleteRole(id: string) {
  await connectDB();

  const roleInUse = await UserModel.exists({
    role: id,
  });
  if (roleInUse) {
    throw new AppError(
      "Cannot delete role: one or more users are assigned to this role",
      409
    );
  }

  const role = await RoleModel.findByIdAndDelete(id);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  return { success: true };
}
