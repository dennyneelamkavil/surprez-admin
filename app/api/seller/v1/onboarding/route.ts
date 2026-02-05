import { NextResponse } from "next/server";
import { SellerOnboardingSchema } from "@/server/seller/onboarding/onboarding.validation";
import { completeSellerOnboarding } from "@/server/seller/onboarding/onboarding.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireSellerAuth } from "@/server/auth/sellerAuth";

export async function POST(req: Request) {
  try {
    // 🔐 authenticate seller
    const { sellerId } = await requireSellerAuth(req);

    const body = await req.json();
    const parsed = SellerOnboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await completeSellerOnboarding(sellerId, parsed.data),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
