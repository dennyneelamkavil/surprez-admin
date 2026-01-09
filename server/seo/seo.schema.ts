import { Schema } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";

export const SeoSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    canonical: {
      type: String,
      trim: true,
    },
    noIndex: {
      type: Boolean,
      default: false,
    },
    ogImage: {
      type: MediaSchema,
    },
  },
  { _id: false }
);
