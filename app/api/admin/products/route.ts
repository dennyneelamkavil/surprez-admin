import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { createProduct, listProducts } from "@/server/product/product.service";
import { CreateProductSchema } from "@/server/product/product.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("product:create");

    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(await createProduct(parsed.data), { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission([
      "product:read",
      "productinventory:read",
      "productinventory:create",
      "productinventory:update",
    ]);

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const subcategoryId = searchParams.get("subcategoryId") ?? undefined;
    const isFeatured = searchParams.get("isFeatured") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    return NextResponse.json(
      await listProducts({
        page,
        limit,
        search,
        subcategoryId,
        isFeatured,
        all,
        sortBy,
        sortDir,
        isActive,
      })
    );
  } catch (err) {
    return handleApiError(err);
  }
}
