import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { createProduct, listProducts } from "@/server/product/product.service";
import { CreateProductSchema } from "@/server/product/product.validation";

export async function POST(req: Request) {
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
}

export async function GET(req: Request) {
  await requirePermission("product:read");

  const { searchParams } = new URL(req.url);

  const all = searchParams.get("all") === "true";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const subcategoryId = searchParams.get("subcategoryId") ?? undefined;
  const isFeatured =
    searchParams.get("isFeatured") === "true" ? true : undefined;

  return NextResponse.json(
    await listProducts({
      page,
      limit,
      search,
      subcategoryId,
      isFeatured,
      all,
    })
  );
}
