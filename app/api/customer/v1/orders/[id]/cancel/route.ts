import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { cancelCustomerOrder } from "@/server/customer/orders/orders.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireCustomerAuth(req);
    return NextResponse.json(
      await cancelCustomerOrder(auth.customerId, params.id),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
