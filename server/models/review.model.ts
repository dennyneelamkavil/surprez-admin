import "server-only";
import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ReviewSchema.index({ product: 1, customer: 1 }, { unique: true });

export const ReviewModel = models.Review || model("Review", ReviewSchema);
