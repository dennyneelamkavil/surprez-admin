import "server-only";
import { Schema, model, models } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";
import { SeoSchema } from "@/server/seo/seo.schema";

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
      type: MediaSchema,
      required: true,
    },
    images: [MediaSchema],
    videos: [MediaSchema],
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
    seo: {
      type: SeoSchema,
    },
  },
  { timestamps: true }
);

export const ProductModel = models.Product || model("Product", ProductSchema);
