import { NextResponse } from "next/server";
import { SellerLoginSchema } from "@/server/seller/auth/auth.validation";
import { loginSeller } from "@/server/seller/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SellerLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await loginSeller(parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}
