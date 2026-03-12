import { NextRequest, NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { cancelCustomerOrder } from "@/server/customer/orders/orders.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await requireCustomerAuth(request);
    return NextResponse.json(await cancelCustomerOrder(auth.customerId, id));
  } catch (err) {
    return handleApiError(err);
  }
}
