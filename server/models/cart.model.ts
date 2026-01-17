import "server-only";
import { Schema, model, models } from "mongoose";

const CartItemSchema = new Schema(
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
      min: 1,
    },

    /* PRICE SNAPSHOT */
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

const CartSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true, // one active cart per customer
      index: true,
    },

    items: [CartItemSchema],

    totals: {
      mrpTotal: {
        type: Number,
        default: 0,
      },
      sellingTotal: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

export const CartModel = models.Cart || model("Cart", CartSchema);
