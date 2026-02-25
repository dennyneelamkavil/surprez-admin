import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";

import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "@/server/customer-management/customer.service";

import { UpdateCustomerSchema } from "@/server/customer-management/customer.validation";
import { handleApiError } from "@/server/errors/handleApiError";

/* ================= GET ================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await requirePermission("customer:read");

    return NextResponse.json(await getCustomerById(id));
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= UPDATE ================= */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await requirePermission("customer:update");

    const body = await request.json();
    const parsed = UpdateCustomerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await updateCustomer(id, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= DELETE ================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await requirePermission("customer:delete");

    await deleteCustomer(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
