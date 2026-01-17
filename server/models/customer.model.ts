import "server-only";
import { Schema, model, models } from "mongoose";

const AddressSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    addressLine1: {
      type: String,
      trim: true,
      required: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
    },
    pincode: {
      type: String,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const CustomerSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [AddressSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

CustomerSchema.index({ phone: 1, isActive: 1 });
CustomerSchema.index({ email: 1 });

export const CustomerModel =
  models.Customer || model("Customer", CustomerSchema);
