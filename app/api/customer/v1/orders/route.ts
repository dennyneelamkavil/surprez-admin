import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import {
  checkout,
  listCustomerOrders,
} from "@/server/customer/orders/orders.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);
    return NextResponse.json(await listCustomerOrders(auth.customerId));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);
    const body = await req.json();
    return NextResponse.json(await checkout(auth.customerId, body.method));
  } catch (err) {
    return handleApiError(err);
  }
}
