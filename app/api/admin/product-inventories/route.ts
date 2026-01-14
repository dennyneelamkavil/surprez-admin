import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createProductInventory,
  listProductInventories,
} from "@/server/product-inventory/product-inventory.service";
import { CreateProductInventorySchema } from "@/server/product-inventory/product-inventory.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("productinventory:create");

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
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission("productinventory:read");

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    return NextResponse.json(
      await listProductInventories({ productId, isActive })
    );
  } catch (err) {
    return handleApiError(err);
  }
}
