import "server-only";
import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: [String],
    videos: [String],
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        index: true,
      },
    ],
    description: {
      type: String,
    },
    attributes: {
      type: Schema.Types.Mixed,
      /*
        Example:
        {
          material: "Cotton",
          warranty: "1 year",
          brand: "Nike",
          color: ["Red", "Blue"],
          size: ["M", "L"]
        }
      */
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ subcategories: 1 });

export const ProductModel = models.Product || model("Product", ProductSchema);
