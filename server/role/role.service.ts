import "server-only";
import { connectDB } from "@/server/db";
import { RoleModel } from "@/server/models/role.model";
import "@/server/models/permission.model";
import { mapRole } from "@/server/role/role.mapper";
import type {
  CreateRoleInput,
  UpdateRoleInput,
} from "@/server/role/role.validation";

/* ================= CREATE ================= */
export async function createRole(input: CreateRoleInput) {
  await connectDB();

  const exists = await RoleModel.findOne({ name: input.name });
  if (exists) throw new Error("Role already exists");

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
}) {
  await connectDB();

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const query: any = {};

  if (params.search) {
    query.name = { $regex: params.search, $options: "i" };
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

  if (!role) throw new Error("Role not found");
  return mapRole(role);
}

/* ================= UPDATE ================= */
export async function updateRole(id: string, input: UpdateRoleInput) {
  await connectDB();

  const role = await RoleModel.findByIdAndUpdate(id, input, {
    new: true,
  }).populate("permissions");

  if (!role) throw new Error("Role not found");
  return mapRole(role);
}

/* ================= DELETE ================= */
export async function deleteRole(id: string) {
  await connectDB();

  const role = await RoleModel.findByIdAndDelete(id);
  if (!role) throw new Error("Role not found");

  return { success: true };
}
