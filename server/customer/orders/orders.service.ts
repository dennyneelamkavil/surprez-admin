import "server-only";

import { connectDB } from "@/server/db";
import { CartModel } from "@/server/models/cart.model";
import { OrderModel } from "@/server/models/order.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { PaymentModel } from "@/server/models/payment.model";
import { AppError } from "@/server/errors/AppError";
import { mapCustomerOrder } from "./orders.mapper";
import { getNextSequence } from "@/server/utils/counter.util";

/* ================= UTIL ================= */
async function generateOrderNumber() {
  const seq = await getNextSequence("order");
  const year = new Date().getFullYear();

  return `ORD-${year}-${seq.toString().padStart(6, "0")}`;
}

/* ================= CHECKOUT ================= */

export async function checkout(customerId: string, method: string) {
  await connectDB();

  const cart = await CartModel.findOne({ customer: customerId })
    .populate({
      path: "items.product",
      populate: { path: "seller" },
    })
    .populate("items.inventory");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  // Validate stock
  for (const item of cart.items) {
    const inventory = await ProductInventoryModel.findById(item.inventory._id);
    if (!inventory || inventory.stock < item.quantity) {
      throw new AppError("Insufficient stock", 400);
    }
  }

  // Group by seller
  const grouped: Record<string, any[]> = {};

  for (const item of cart.items) {
    const sellerId = item.product.seller.toString();
    if (!grouped[sellerId]) grouped[sellerId] = [];
    grouped[sellerId].push(item);
  }

  const createdOrders = [];

  for (const sellerId of Object.keys(grouped)) {
    const items = grouped[sellerId];

    const mrpTotal = items.reduce((s, i) => s + i.price.mrp * i.quantity, 0);
    const sellingTotal = items.reduce(
      (s, i) => s + i.price.sellingPrice * i.quantity,
      0,
    );

    const order = await OrderModel.create({
      orderNumber: await generateOrderNumber(),
      customer: customerId,
      seller: sellerId,
      items,
      totals: {
        mrpTotal,
        sellingTotal,
        discountTotal: mrpTotal - sellingTotal,
        payableTotal: sellingTotal,
      },
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    createdOrders.push(order);
  }

  const totalAmount = createdOrders.reduce(
    (s, o) => s + o.totals.payableTotal,
    0,
  );

  const payment = await PaymentModel.create({
    orders: createdOrders.map((o) => o._id),
    customer: customerId,
    method,
    amount: totalAmount,
    status: "pending",
  });

  return {
    paymentId: payment._id,
    amount: payment.amount,
    orderIds: createdOrders.map((o) => o._id),
  };
}

/* ================= LIST ================= */

export async function listCustomerOrders(customerId: string) {
  await connectDB();

  const orders = await OrderModel.find({ customer: customerId })
    .sort({ createdAt: -1 })
    .lean();

  return orders.map(mapCustomerOrder);
}

/* ================= GET ================= */

export async function getCustomerOrder(customerId: string, orderId: string) {
  await connectDB();

  const order = await OrderModel.findOne({
    _id: orderId,
    customer: customerId,
  }).lean();

  if (!order) throw new AppError("Order not found", 404);

  return mapCustomerOrder(order);
}

/* ================= CANCEL ================= */

export async function cancelCustomerOrder(customerId: string, orderId: string) {
  await connectDB();

  const order = await OrderModel.findOne({
    _id: orderId,
    customer: customerId,
  });

  if (!order) throw new AppError("Order not found", 404);

  if (!["placed", "confirmed"].includes(order.orderStatus)) {
    throw new AppError("Order cannot be cancelled", 400);
  }

  order.orderStatus = "cancelled";
  await order.save();

  return { success: true };
}
