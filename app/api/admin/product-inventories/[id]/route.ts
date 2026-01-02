import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getProductInventoryById,
  updateProductInventory,
  deleteProductInventory,
} from "@/server/product-inventory/product-inventory.service";
import { UpdateProductInventorySchema } from "@/server/product-inventory/product-inventory.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("productinventory:read");
  return NextResponse.json(await getProductInventoryById(id));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("productinventory:update");

  const body = await request.json();
  const parsed = UpdateProductInventorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateProductInventory(id, parsed.data));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("productinventory:delete");
  await deleteProductInventory(id);
  return NextResponse.json({ success: true });
}
