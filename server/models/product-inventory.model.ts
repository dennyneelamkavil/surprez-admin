import "server-only";
import { Schema, model, models } from "mongoose";

const ShippingSchema = new Schema(
  {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: "cm" },
    },
    weight: {
      value: Number,
      unit: { type: String, default: "kg" },
    },
    handlingTime: {
      type: Number, // days
      required: true,
    },
    shippingTemplate: {
      type: String, // reference key
    },
  },
  { _id: false },
);

const ProductInventorySchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      mrp: {
        type: Number,
        required: true,
        min: 0,
      },
      sellingPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    attributes: {
      type: Map,
      of: String,
      /*
        Example:
        {
          color: "Red",
          size: "M"
        }
      */
    },
    barcode: {
      type: String,
      index: true,
    },

    shipping: ShippingSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

ProductInventorySchema.index({ product: 1, "price.sellingPrice": 1 });

export const ProductInventoryModel =
  models.ProductInventory || model("ProductInventory", ProductInventorySchema);
