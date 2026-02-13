import "server-only";

import { connectDB } from "@/server/db";
import { CustomerModel } from "@/server/models/customer.model";
import { AppError } from "@/server/errors/AppError";
import { mapWishlistProduct } from "./wishlist.mapper";

export async function listWishlist(customerId: string) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId)
    .populate("wishlist")
    .lean();

  if (!customer) throw new AppError("Customer not found", 404);

  return customer.wishlist.map(mapWishlistProduct);
}

export async function addToWishlist(customerId: string, productId: string) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  if (!customer.wishlist.includes(productId as any)) {
    customer.wishlist.push(productId as any);
    await customer.save();
  }

  return { success: true };
}

export async function removeFromWishlist(
  customerId: string,
  productId: string,
) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  customer.wishlist = customer.wishlist.filter(
    (id: (typeof customer.wishlist)[number]) => id.toString() !== productId,
  );

  await customer.save();

  return { success: true };
}
