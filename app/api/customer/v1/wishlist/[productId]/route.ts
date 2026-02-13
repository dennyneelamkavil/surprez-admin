import { NextRequest, NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/server/customer/wishlist/wishlist.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const auth = await requireCustomerAuth(req);

    return NextResponse.json(await addToWishlist(auth.customerId, productId), {
      status: 201,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const auth = await requireCustomerAuth(req);

    return NextResponse.json(
      await removeFromWishlist(auth.customerId, productId),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
