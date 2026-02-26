import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { listOrders } from "@/server/order/order.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    await requirePermission("order:read");

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    return NextResponse.json(
      await listOrders({
        page,
        limit,
        search: searchParams.get("search") ?? undefined,
        sortBy: searchParams.get("sortBy") ?? undefined,
        sortDir: searchParams.get("sortDir") ?? undefined,
        orderStatus: searchParams.get("orderStatus") ?? undefined,
        paymentStatus: searchParams.get("paymentStatus") ?? undefined,
        sellerId: searchParams.get("sellerId") ?? undefined,
        customerId: searchParams.get("customerId") ?? undefined,
        fromDate: searchParams.get("fromDate") ?? undefined,
        toDate: searchParams.get("toDate") ?? undefined,
      }),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
