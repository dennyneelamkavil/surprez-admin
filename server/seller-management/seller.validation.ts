import "server-only";
import { z } from "zod";

/* ================= BANK DETAILS ================= */

const BankDetailsValidation = z.object({
  accountHolderName: z.string().min(2),
  accountNumber: z.string().min(4),
  ifscCode: z.string().min(4),
  bankName: z.string().min(2),
});

/* ================= BUSINESS ADDRESS ================= */

const BusinessAddressValidation = z.object({
  address: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  country: z.string().default("India"),
});

/* ================= ENUMS ================= */

const SellerTypeEnum = z.enum(["vendor", "craft_maker"]);

const BusinessTypeEnum = z.enum([
  "individual",
  "proprietorship",
  "partnership",
  "llp",
  "private_limited",
  "public_limited",
]);

const SellerStatusEnum = z.enum([
  "pending",
  "approved",
  "suspended",
  "rejected",
]);

/* ================= CREATE SCHEMA ================= */

export const CreateSellerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),

  sellerType: SellerTypeEnum.optional(),
  businessName: z.string().min(2),
  businessType: BusinessTypeEnum.optional(),
  legalName: z.string().optional(),
  gstin: z.string().optional(),

  businessAddress: BusinessAddressValidation.optional(),
  bankDetails: BankDetailsValidation.optional(),

  status: SellerStatusEnum.optional(),
  isActive: z.boolean().optional(),
  approvedAt: z.string().datetime().optional(),
  rejectedReason: z.string().optional(),
});

/* ================= UPDATE SCHEMA ================= */

export const UpdateSellerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),

  sellerType: SellerTypeEnum.optional(),
  businessName: z.string().min(2).optional(),
  businessType: BusinessTypeEnum.optional(),
  legalName: z.string().optional(),
  gstin: z.string().optional(),

  businessAddress: BusinessAddressValidation.optional(),
  bankDetails: BankDetailsValidation.optional(),

  status: SellerStatusEnum.optional(),
  isActive: z.boolean().optional(),
  approvedAt: z.string().datetime().optional(),
  rejectedReason: z.string().optional(),
});

/* ================= TYPES ================= */

export type CreateSellerInput = z.infer<typeof CreateSellerSchema>;
export type UpdateSellerInput = z.infer<typeof UpdateSellerSchema>;
