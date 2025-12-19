import "server-only";
import { Schema, model, models } from "mongoose";

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
      },
      sellingPrice: {
        type: Number,
        required: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProductInventorySchema.index({ product: 1, "price.sellingPrice": 1 });

export const ProductInventoryModel =
  models.ProductInventory || model("ProductInventory", ProductInventorySchema);
