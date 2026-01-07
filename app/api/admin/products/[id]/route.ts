import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/server/product/product.service";
import { UpdateProductSchema } from "@/server/product/product.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("product:read");
    return NextResponse.json(await getProductById(id));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("product:update");

    const body = await request.json();
    const parsed = UpdateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(await updateProduct(id, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("product:delete");
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
