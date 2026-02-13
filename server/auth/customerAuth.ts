import "server-only";
import jwt from "jsonwebtoken";

import { CustomerModel } from "@/server/models/customer.model";
import { AppError } from "@/server/errors/AppError";

const CUSTOMER_JWT_SECRET = process.env.CUSTOMER_JWT_SECRET!;

type CustomerTokenPayload = {
  sub: string;
  type: "customer";
  iat: number;
  exp: number;
};

export async function requireCustomerAuth(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token missing", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  let payload: CustomerTokenPayload;
  try {
    payload = jwt.verify(token, CUSTOMER_JWT_SECRET) as CustomerTokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

  if (payload.type !== "customer") {
    throw new AppError("Invalid token type", 401);
  }

  const customer = await CustomerModel.findById(payload.sub).select(
    "_id isActive",
  );

  if (!customer || !customer.isActive) {
    throw new AppError("Customer not found", 401);
  }

  return {
    customerId: customer._id.toString(),
  };
}
