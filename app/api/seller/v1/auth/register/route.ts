import { NextResponse } from "next/server";
import { SellerRegisterSchema } from "@/server/seller/auth/auth.validation";
import { registerSeller } from "@/server/seller/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SellerRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await registerSeller(parsed.data), {
      status: 201,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
