import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { getOrderById } from "@/server/order/order.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await requirePermission("order:read");

    return NextResponse.json(await getOrderById(id));
  } catch (err) {
    return handleApiError(err);
  }
}
