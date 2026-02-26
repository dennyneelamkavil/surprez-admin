import "server-only";

import { connectDB } from "@/server/db";
import { CartModel } from "@/server/models/cart.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { AppError } from "@/server/errors/AppError";
import { mapCart } from "./cart.mapper";

/* ================= UTIL ================= */
function calculateTotals(items: any[]) {
  const mrpTotal = items.reduce((sum, i) => sum + i.price.mrp * i.quantity, 0);

  const sellingTotal = items.reduce(
    (sum, i) => sum + i.price.sellingPrice * i.quantity,
    0,
  );

  return { mrpTotal, sellingTotal };
}

/* ================= GET ================= */
export async function getCart(customerId: string) {
  await connectDB();

  const cart = await CartModel.findOne({ customer: customerId })
    .populate("items.product")
    .populate("items.inventory")
    .lean();

  if (!cart) {
    return {
      items: [],
      totals: { mrpTotal: 0, sellingTotal: 0 },
    };
  }

  return mapCart(cart);
}

/* ================= ADD ================= */
export async function addToCart(
  customerId: string,
  inventoryId: string,
  quantity: number,
) {
  await connectDB();

  const inventory =
    await ProductInventoryModel.findById(inventoryId).populate("product");

  if (!inventory || !inventory.isActive) {
    throw new AppError("Inventory not available", 400);
  }

  let cart = await CartModel.findOne({ customer: customerId });

  if (!cart) {
    cart = await CartModel.create({
      customer: customerId,
      items: [],
    });
  }

  const existing = cart.items.find(
    (i: any) => i.inventory.toString() === inventoryId,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: inventory.product._id,
      inventory: inventory._id,
      quantity,
      price: {
        mrp: inventory.price.mrp,
        sellingPrice: inventory.price.sellingPrice,
      },
    });
  }

  cart.totals = calculateTotals(cart.items);

  await cart.save();

  return getCart(customerId);
}

/* ================= UPDATE ================= */
export async function updateCartItem(
  customerId: string,
  inventoryId: string,
  quantity: number,
) {
  await connectDB();

  const cart = await CartModel.findOne({ customer: customerId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const item = cart.items.find(
    (i: any) => i.inventory.toString() === inventoryId,
  );

  if (!item) {
    throw new AppError("Item not found in cart", 404);
  }

  item.quantity = quantity;

  cart.totals = calculateTotals(cart.items);

  await cart.save();

  return getCart(customerId);
}

/* ================= REMOVE ================= */
export async function removeCartItem(customerId: string, inventoryId: string) {
  await connectDB();

  const cart = await CartModel.findOne({ customer: customerId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter(
    (i: any) => i.inventory.toString() !== inventoryId,
  );

  cart.totals = calculateTotals(cart.items);

  await cart.save();

  return getCart(customerId);
}
