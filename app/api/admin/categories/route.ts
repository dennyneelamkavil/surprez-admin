import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createCategory,
  listCategories,
} from "@/server/category/category.service";
import { CreateCategorySchema } from "@/server/category/category.validation";

export async function POST(req: Request) {
  await requirePermission("category:create");

  const body = await req.json();
  const parsed = CreateCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const category = await createCategory(parsed.data);
  return NextResponse.json(category, { status: 201 });
}

export async function GET(req: Request) {
  await requirePermission("category:read");

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? undefined;

  const categories = await listCategories({ page, limit, search });
  return NextResponse.json(categories);
}
