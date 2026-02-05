import "server-only";
import { Schema, model, models } from "mongoose";

const BankDetailsSchema = new Schema(
  {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },
  { _id: false },
);

const SellerSchema = new Schema(
  {
    /* ================= AUTH ================= */
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    /* ================= SELLER TYPE ================= */
    sellerType: {
      type: String,
      enum: ["vendor", "craft_maker"],
      required: true,
      index: true,
    },

    /* ================= BUSINESS ================= */
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      enum: [
        "individual",
        "proprietorship",
        "partnership",
        "llp",
        "private_limited",
        "public_limited",
      ],
    },

    legalName: {
      type: String,
      trim: true,
    },

    gstin: {
      type: String,
      trim: true,
      index: true,
    },

    businessAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },

    /* ================= PAYOUT ================= */
    bankDetails: BankDetailsSchema,

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["pending", "approved", "suspended", "rejected"],
      default: "pending",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ================= META ================= */
    lastLoginAt: {
      type: Date,
    },

    approvedAt: {
      type: Date,
    },

    rejectedReason: {
      type: String,
    },
  },
  { timestamps: true },
);

/* ================= INDEXES ================= */
SellerSchema.index({ email: 1, status: 1 });

export const SellerModel = models.Seller || model("Seller", SellerSchema);
