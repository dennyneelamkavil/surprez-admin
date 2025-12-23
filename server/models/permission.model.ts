import "server-only";
import { Schema, model, models } from "mongoose";

const PermissionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g. "user:create"
    },
    description: String,
  },
  { timestamps: true }
);

PermissionSchema.index({ key: 1 });

export const PermissionModel =
  models.Permission || model("Permission", PermissionSchema);
