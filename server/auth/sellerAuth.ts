import "server-only";
import jwt from "jsonwebtoken";

import { connectDB } from "@/server/db";
import { SellerModel } from "@/server/models/seller.model";
import { AppError } from "@/server/errors/AppError";

const SELLER_JWT_SECRET = process.env.SELLER_JWT_SECRET!;

type SellerTokenPayload = {
  sub: string;
  type: "seller";
  iat: number;
  exp: number;
};

export async function requireSellerAuth(req: Request) {
  await connectDB();

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token missing", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  let payload: SellerTokenPayload;
  try {
    payload = jwt.verify(token, SELLER_JWT_SECRET) as SellerTokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

  if (payload.type !== "seller") {
    throw new AppError("Invalid token type", 401);
  }

  const seller = await SellerModel.findById(payload.sub).select(
    "_id isActive status",
  );

  if (!seller || !seller.isActive) {
    throw new AppError("Seller not found", 401);
  }

  return {
    sellerId: seller._id.toString(),
    status: seller.status,
  };
}
