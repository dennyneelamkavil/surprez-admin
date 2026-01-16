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
    await requirePermission("inventory:create");

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
    await requirePermission("inventory:read");

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") ?? undefined;
    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    return NextResponse.json(
      await listProductInventories({
        page,
        limit,
        search,
        all,
        sortBy,
        sortDir,
        productId,
        isActive,
      })
    );
  } catch (err) {
    return handleApiError(err);
  }
}
