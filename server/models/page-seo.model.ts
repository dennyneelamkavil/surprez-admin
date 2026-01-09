import "server-only";
import { Schema, model, models } from "mongoose";
import { SeoSchema } from "@/server/seo/seo.schema";

const PageSeoSchema = new Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      /*
        Examples:
        "home"
        "about"
        "contact"
        "privacy-policy"
      */
    },
    seo: {
      type: SeoSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PageSeoModel = models.PageSeo || model("PageSeo", PageSeoSchema);
