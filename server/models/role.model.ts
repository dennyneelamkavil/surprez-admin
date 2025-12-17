import "server-only";
import { Schema, model, models, Types } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // e.g. "admin", "editor", "super-admin"
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const RoleModel = models.Role || model("Role", RoleSchema);
