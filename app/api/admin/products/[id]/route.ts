import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/server/product/product.service";
import { UpdateProductSchema } from "@/server/product/product.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("product:read");
  return NextResponse.json(await getProductById(id));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("product:delete");
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
