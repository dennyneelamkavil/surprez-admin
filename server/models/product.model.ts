import "server-only";
import { Schema, model, models } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";
import { SeoSchema } from "@/server/seo/seo.schema";

const ProductSchema = new Schema(
  {
    // basic details
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
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      required: true,
    },

    // media
    coverImage: {
      type: MediaSchema,
      required: true,
    },
    images: [MediaSchema],
    videos: [MediaSchema],

    // sub categories and description
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

    // variants
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

    // features and specifications
    keyFeatures: {
      type: [String],
      required: true,
    },
    ingredientsOrMaterial: {
      type: String,
      trim: true,
    },

    // instructions and warnings
    usageInstructions: String,
    safetyWarnings: String,

    // policies
    warranty: {
      period: String,
      details: String,
    },
    returnPolicy: {
      type: String,
    },

    // rating
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

    // status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // SEO
    seo: {
      type: SeoSchema,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const ProductModel = models.Product || model("Product", ProductSchema);
