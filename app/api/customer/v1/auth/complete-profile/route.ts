import { NextResponse } from "next/server";
import { CompleteProfileSchema } from "@/server/customer/auth/auth.validation";
import { completeProfile } from "@/server/customer/auth/auth.service";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = CompleteProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await completeProfile(auth.customerId, parsed.data),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
