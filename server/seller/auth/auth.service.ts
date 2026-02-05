import "server-only";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectDB } from "@/server/db";
import { SellerModel } from "@/server/models/seller.model";
import { AppError } from "@/server/errors/AppError";

import type { SellerLoginInput, SellerRegisterInput } from "./auth.validation";

const SELLER_JWT_SECRET = process.env.SELLER_JWT_SECRET!;

export async function registerSeller(input: SellerRegisterInput) {
  await connectDB();

  const existing = await SellerModel.findOne({
    email: input.email,
  });

  if (existing) {
    throw new AppError("Seller already exists with this email", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const seller = await SellerModel.create({
    email: input.email,
    phone: input.phone,
    passwordHash,

    businessName: input.businessName,

    status: "pending",
    isActive: true,
  });

  const token = jwt.sign(
    {
      sub: seller._id.toString(),
      type: "seller",
    },
    SELLER_JWT_SECRET,
    { expiresIn: "1d" }, // shorter lifespan is better here
  );

  return {
    token,
    seller: {
      id: seller._id.toString(),
      email: seller.email,
      businessName: seller.businessName,
      status: seller.status,
    },
  };
}

export async function loginSeller(input: SellerLoginInput) {
  await connectDB();

  const seller = await SellerModel.findOne({
    email: input.email,
  });

  if (!seller) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!seller.isActive) {
    throw new AppError("Seller account is inactive", 403);
  }

  if (seller.status !== "approved") {
    throw new AppError("Seller account is not approved yet", 403);
  }

  const isValid = await bcrypt.compare(input.password, seller.passwordHash);

  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      sub: seller._id.toString(),
      type: "seller",
    },
    SELLER_JWT_SECRET,
    { expiresIn: "7d" },
  );

  seller.lastLoginAt = new Date();
  await seller.save();

  return {
    token,
    seller: {
      id: seller._id.toString(),
      email: seller.email,
      businessName: seller.businessName,
      status: seller.status,
    },
  };
}
