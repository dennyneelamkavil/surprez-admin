import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createCategory,
  listCategories,
} from "@/server/category/category.service";
import { CreateCategorySchema } from "@/server/category/category.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
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
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission([
      "category:read",
      "subcategory:read",
      "subcategory:create",
      "subcategory:update",
    ]);

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    const categories = await listCategories({
      page,
      limit,
      search,
      all,
      sortBy,
      sortDir,
      isActive,
    });

    return NextResponse.json(categories);
  } catch (err) {
    return handleApiError(err);
  }
}
