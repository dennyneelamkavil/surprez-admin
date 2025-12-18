import "server-only";
import { connectDB } from "../db";
import { UserModel } from "../models/user.model";
import "../models/role.model";
import "../models/permission.model";
import bcrypt from "bcryptjs";

type CreateUserInput = {
  username: string;
  password: string;
  fullname: string;
  email?: string;
  phone?: string;
};

export async function createUser(input: CreateUserInput) {
  await connectDB();

  const exists = await UserModel.findOne({ username: input.username }).lean();
  if (exists) throw new Error("Username already taken");

  const passwordHash = await bcrypt.hash(input.password, 12);

  const doc = await UserModel.create({
    username: input.username,
    password: passwordHash,
    fullname: input.fullname,
    email: input.email,
    phone: input.phone,
  });

  return {
    id: String(doc._id),
    username: doc.username,
    fullname: doc.fullname,
    email: doc.email,
    phone: doc.phone,
  };
}

export async function verifyUser(username: string, password: string) {
  await connectDB();

  const user = await UserModel.findOne({ username }).populate({
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
