import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { verifyPayment } from "@/server/customer/payment/payment.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);
    const body = await req.json();

    return NextResponse.json(
      await verifyPayment(auth.customerId, body.paymentId, body.success),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
