import "server-only";

import { connectDB } from "@/server/db";
import { PaymentModel } from "@/server/models/payment.model";
import { OrderModel } from "@/server/models/order.model";
import { ProductInventoryModel } from "@/server/models/product-inventory.model";
import { CartModel } from "@/server/models/cart.model";
import { AppError } from "@/server/errors/AppError";

export async function verifyPayment(
  customerId: string,
  paymentId: string,
  success: boolean,
) {
  await connectDB();

  const payment = await PaymentModel.findOne({
    _id: paymentId,
    customer: customerId,
  });

  if (!payment) throw new AppError("Payment not found", 404);

  if (success) {
    payment.status = "success";

    // Update orders
    await OrderModel.updateMany(
      { _id: { $in: payment.orders } },
      { paymentStatus: "paid" },
    );

    // Deduct stock
    const orders = await OrderModel.find({
      _id: { $in: payment.orders },
    });

    for (const order of orders) {
      for (const item of order.items) {
        await ProductInventoryModel.findByIdAndUpdate(item.inventory, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Clear cart
    await CartModel.deleteOne({ customer: customerId });
  } else {
    payment.status = "failed";

    await OrderModel.updateMany(
      { _id: { $in: payment.orders } },
      { paymentStatus: "failed" },
    );
  }

  await payment.save();

  return { success: true };
}
