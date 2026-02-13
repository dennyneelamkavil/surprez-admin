import { NextResponse } from "next/server";
import { RequestOtpSchema } from "@/server/customer/auth/auth.validation";
import { requestOtp } from "@/server/customer/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await requestOtp(parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}
