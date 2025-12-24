import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createProductInventory,
  listProductInventories,
} from "@/server/product-inventory/product-inventory.service";
import { CreateProductInventorySchema } from "@/server/product-inventory/product-inventory.validation";

export async function POST(req: Request) {
  await requirePermission("product-inventory:create");

  const body = await req.json();
  const parsed = CreateProductInventorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await createProductInventory(parsed.data), {
    status: 201,
  });
}

export async function GET(req: Request) {
  await requirePermission("product-inventory:read");

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId") ?? undefined;

  return NextResponse.json(await listProductInventories({ productId }));
}
