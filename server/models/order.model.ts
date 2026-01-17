import "server-only";
import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "ProductInventory",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },

    /* FINAL PRICE SNAPSHOT */
    price: {
      mrp: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
    },
  },
  { _id: false },
);

const AddressSnapshotSchema = new Schema(
  {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    items: [OrderItemSchema],

    deliveryAddress: AddressSnapshotSchema,

    totals: {
      mrpTotal: Number,
      sellingTotal: Number,
      discountTotal: Number,
      payableTotal: Number,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  { timestamps: true },
);

export const OrderModel = models.Order || model("Order", OrderSchema);
