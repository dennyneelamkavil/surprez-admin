import "server-only";
import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    method: {
      type: String,
      enum: ["cod", "online", "wallet", "other"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    gateway: {
      orderId: String,
      paymentId: String,
      signature: String,
      rawResponse: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

export const PaymentModel = models.Payment || model("Payment", PaymentSchema);
