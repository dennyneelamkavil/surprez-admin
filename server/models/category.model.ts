import "server-only";
import { Schema, model, models } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";
import { SeoSchema } from "@/server/seo/seo.schema";

const CategorySchema = new Schema(
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
    image: {
      type: MediaSchema,
      required: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: {
      type: SeoSchema,
    },
  },
  { timestamps: true }
);

export const CategoryModel =
  models.Category || model("Category", CategorySchema);
