import "server-only";

import { connectDB } from "@/server/db";
import { SellerModel } from "@/server/models/seller.model";
import { AppError } from "@/server/errors/AppError";

import type { SellerOnboardingInput } from "./onboarding.validation";

export async function completeSellerOnboarding(
  sellerId: string,
  input: SellerOnboardingInput,
) {
  await connectDB();

  const seller = await SellerModel.findById(sellerId);
  if (!seller) {
    throw new AppError("Seller not found", 404);
  }

  if (seller.status !== "pending") {
    throw new AppError("Seller onboarding already completed", 400);
  }

  seller.sellerType = input.sellerType;
  seller.businessType = input.businessType;
  seller.legalName = input.legalName;
  seller.gstin = input.gstin;
  seller.businessAddress = input.businessAddress;

  await seller.save();

  return {
    success: true,
  };
}
