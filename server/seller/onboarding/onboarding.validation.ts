import "server-only";
import { z } from "zod";

export const SellerOnboardingSchema = z.object({
  sellerType: z.enum(["vendor", "craft_maker"]),

  businessType: z
    .enum([
      "individual",
      "proprietorship",
      "partnership",
      "llp",
      "private_limited",
      "public_limited",
    ])
    .optional(),

  legalName: z.string().optional(),

  gstin: z.string().optional(),

  businessAddress: z.object({
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().optional(),
  }),
});

export type SellerOnboardingInput = z.infer<typeof SellerOnboardingSchema>;
