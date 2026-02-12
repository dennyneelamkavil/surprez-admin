import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";

import {
  getSellerById,
  updateSeller,
  deleteSeller,
} from "@/server/seller-management/seller.service";

import { UpdateSellerSchema } from "@/server/seller-management/seller.validation";
import { handleApiError } from "@/server/errors/handleApiError";

/* ================= GET ================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await requirePermission("seller:read");

    return NextResponse.json(await getSellerById(id));
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

    await requirePermission("seller:update");

    const body = await request.json();
    const parsed = UpdateSellerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await updateSeller(id, parsed.data));
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

    await requirePermission("seller:delete");

    await deleteSeller(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
