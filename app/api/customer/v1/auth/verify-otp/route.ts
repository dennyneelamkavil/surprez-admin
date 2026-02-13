import { NextResponse } from "next/server";
import { VerifyOtpSchema } from "@/server/customer/auth/auth.validation";
import { verifyOtp } from "@/server/customer/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await verifyOtp(parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}
