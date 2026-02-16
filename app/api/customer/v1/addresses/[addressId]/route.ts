import { NextRequest, NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { UpdateAddressSchema } from "@/server/customer/addresses/addresses.validation";
import {
  updateAddress,
  deleteAddress,
} from "@/server/customer/addresses/addresses.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> },
) {
  try {
    const { addressId } = await params;
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = UpdateAddressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await updateAddress(auth.customerId, addressId, parsed.data),
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> },
) {
  try {
    const { addressId } = await params;
    const auth = await requireCustomerAuth(req);

    return NextResponse.json(await deleteAddress(auth.customerId, addressId));
  } catch (err) {
    return handleApiError(err);
  }
}
