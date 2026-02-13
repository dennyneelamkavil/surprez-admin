import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import { getCurrentCustomer } from "@/server/customer/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    return NextResponse.json(await getCurrentCustomer(auth.customerId));
  } catch (err) {
    return handleApiError(err);
  }
}
