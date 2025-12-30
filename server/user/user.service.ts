import "server-only";
import bcrypt from "bcryptjs";
import { connectDB } from "@/server/db";
import { UserModel } from "@/server/models/user.model";
import "@/server/models/role.model";
import "@/server/models/permission.model";
import { mapUser } from "@/server/user/user.mapper";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/server/user/user.validation";

/* ================= VERIFY ================= */
export async function verifyUser(username: string, password: string) {
  await connectDB();

  const user = await UserModel.findOne({ username, isActive: true }).populate({
    path: "role",
    populate: { path: "permissions" },
  });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  const role = user.role as any;

  return {
    id: String(user._id),
    username: user.username,
    role: {
      id: String(role._id),
      name: role.name,
      isSuperAdmin: role.isSuperAdmin,
      permissions: role.permissions.map((p: any) => p.key),
    },
  };
}

/* ================= CREATE ================= */
export async function createUser(input: CreateUserInput) {
  await connectDB();

  const exists = await UserModel.findOne({ username: input.username }).lean();
  if (exists) throw new Error("Username already taken");

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await UserModel.create({
    username: input.username,
    password: passwordHash,
    fullname: input.fullname,
    email: input.email,
    phone: input.phone,
    role: input.role,
    isActive: input.isActive ?? true,
  });

  return mapUser(user);
}

/* ================= LIST ================= */
export async function listUsers(params: {
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
    query.$or = [
      { username: { $regex: params.search, $options: "i" } },
      { fullname: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }

  if (params?.all) {
    const users = await UserModel.find(query)
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
      .sort({ key: 1 })
      .lean();

    return {
      users: users.map(mapUser),
      pagination: null,
    };
  }

  const [users, total] = await Promise.all([
    UserModel.find(query)
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users: users.map(mapUser),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/* ================= GET ================= */
export async function getUserById(id: string) {
  await connectDB();

  const user = await UserModel.findById(id)
    .populate({
      path: "role",
      populate: { path: "permissions" },
    })
    .lean();

  if (!user) throw new Error("User not found");
  return mapUser(user);
}

/* ================= UPDATE ================= */
export async function updateUser(id: string, input: UpdateUserInput) {
  await connectDB();

  const update: any = { ...input };

  if (input.password) {
    update.password = await bcrypt.hash(input.password, 12);
  }

  const user = await UserModel.findByIdAndUpdate(id, update, {
    new: true,
  }).populate({
    path: "role",
    populate: { path: "permissions" },
  });

  if (!user) throw new Error("User not found");
  return mapUser(user);
}

/* ================= SOFT DELETE ================= */
export async function deleteUser(id: string) {
  await connectDB();

  const user = await UserModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!user) throw new Error("User not found");
  return { success: true };
}
