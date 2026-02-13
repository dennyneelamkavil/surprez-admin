import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { listWishlist } from "@/server/customer/wishlist/wishlist.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    return NextResponse.json(await listWishlist(auth.customerId));
  } catch (err) {
    return handleApiError(err);
  }
}
