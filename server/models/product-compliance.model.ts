import "server-only";
import { Schema, model, models } from "mongoose";

const ProductComplianceSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    gstin: String,
    hsnCode: {
      type: String,
      required: true,
    },
    manufacturerDetails: {
      name: String,
      address: String,
    },
    certifications: [
      {
        type: {
          type: String, // FSSAI, BIS, COSMETIC
        },
        licenseNumber: String,
        validTill: Date,
      },
    ],
  },
  { timestamps: true },
);

export const ProductComplianceModel =
  models.ProductCompliance ||
  model("ProductCompliance", ProductComplianceSchema);
