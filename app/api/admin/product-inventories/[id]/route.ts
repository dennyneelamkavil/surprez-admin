import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getProductInventoryById,
  updateProductInventory,
  deleteProductInventory,
} from "@/server/product-inventory/product-inventory.service";
import { UpdateProductInventorySchema } from "@/server/product-inventory/product-inventory.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("product-inventory:read");
  return NextResponse.json(await getProductInventoryById(params.id));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("product-inventory:update");

  const body = await req.json();
  const parsed = UpdateProductInventorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(
    await updateProductInventory(params.id, parsed.data)
  );
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("product-inventory:delete");
  await deleteProductInventory(params.id);
  return NextResponse.json({ success: true });
}
