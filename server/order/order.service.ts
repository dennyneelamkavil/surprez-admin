import "server-only";

import { connectDB } from "@/server/db";
import { OrderModel } from "@/server/models/order.model";
import { mapOrder } from "@/server/order/order.mapper";
import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { AppError } from "@/server/errors/AppError";

/* ================= LIST ================= */

export async function listOrders(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: string;
  orderStatus?: string;
  paymentStatus?: string;
  sellerId?: string;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  await connectDB();

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "order",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  /* Search by order number */
  if (params?.search) {
    query.orderNumber = { $regex: params.search, $options: "i" };
  }

  if (params?.orderStatus) {
    query.orderStatus = params.orderStatus;
  }

  if (params?.paymentStatus) {
    query.paymentStatus = params.paymentStatus;
  }

  if (params?.sellerId) {
    query.seller = params.sellerId;
  }

  if (params?.customerId) {
    query.customer = params.customerId;
  }

  if (params?.fromDate || params?.toDate) {
    query.createdAt = {};

    if (params.fromDate) {
      const from = new Date(params.fromDate);
      from.setHours(0, 0, 0, 0);
      query.createdAt.$gte = from;
    }

    if (params.toDate) {
      const to = new Date(params.toDate);
      to.setHours(23, 59, 59, 999);
      query.createdAt.$lte = to;
    }
  }

  const [orders, total] = await Promise.all([
    OrderModel.find(query)
      .populate("customer")
      .populate("seller")
      .populate("items.product")
      .populate("items.inventory")
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    OrderModel.countDocuments(query),
  ]);

  return {
    data: orders.map(mapOrder),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */

export async function getOrderById(id: string) {
  await connectDB();

  const order = await OrderModel.findById(id)
    .populate("customer")
    .populate("seller")
    .populate("items.product")
    .populate("items.inventory")
    .lean();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return mapOrder(order);
}
