import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { UpdateProfileSchema } from "@/server/customer/user/user.validation";
import { updateProfile } from "@/server/customer/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PUT(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await updateProfile(auth.customerId, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}
