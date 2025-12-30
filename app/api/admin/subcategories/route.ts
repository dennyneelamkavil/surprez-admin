import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createSubCategory,
  listSubCategories,
} from "@/server/subcategory/subcategory.service";
import { CreateSubCategorySchema } from "@/server/subcategory/subcategory.validation";

export async function POST(req: Request) {
  await requirePermission("subcategory:create");

  const body = await req.json();
  const parsed = CreateSubCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const subCategory = await createSubCategory(parsed.data);
  return NextResponse.json(subCategory, { status: 201 });
}

export async function GET(req: Request) {
  await requirePermission("subcategory:read");

  const { searchParams } = new URL(req.url);

  const all = searchParams.get("all") === "true";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const data = await listSubCategories({
    page,
    limit,
    search,
    categoryId,
    all,
  });

  return NextResponse.json(data);
}
