import "server-only";
import { Schema } from "mongoose";

export const MediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  { _id: false }
);
