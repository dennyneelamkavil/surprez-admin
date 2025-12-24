import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/server/product/product.service";
import { UpdateProductSchema } from "@/server/product/product.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("product:read");
  return NextResponse.json(await getProductById(params.id));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("product:update");

  const body = await req.json();
  const parsed = UpdateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateProduct(params.id, parsed.data));
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("product:delete");
  await deleteProduct(params.id);
  return NextResponse.json({ success: true });
}
