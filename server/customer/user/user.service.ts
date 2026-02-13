import "server-only";

import { connectDB } from "@/server/db";
import { CustomerModel } from "@/server/models/customer.model";
import { AppError } from "@/server/errors/AppError";
import { mapCustomer } from "./user.mapper";
import type { UpdateProfileInput } from "./user.validation";

export async function getCurrentCustomer(customerId: string) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId).lean();

  if (!customer) throw new AppError("Customer not found", 404);

  return mapCustomer(customer);
}

export async function updateProfile(
  customerId: string,
  input: UpdateProfileInput,
) {
  await connectDB();

  const updated = await CustomerModel.findByIdAndUpdate(customerId, input, {
    new: true,
  }).lean();

  if (!updated) throw new AppError("Customer not found", 404);

  return mapCustomer(updated);
}
