import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { CreateAddressSchema } from "@/server/customer/addresses/addresses.validation";
import {
  listAddresses,
  createAddress,
} from "@/server/customer/addresses/addresses.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    return NextResponse.json(await listAddresses(auth.customerId));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = CreateAddressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await createAddress(auth.customerId, parsed.data),
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
