import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { getCustomerOrder } from "@/server/customer/orders/orders.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireCustomerAuth(req);
    return NextResponse.json(
      await getCustomerOrder(auth.customerId, params.id),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
