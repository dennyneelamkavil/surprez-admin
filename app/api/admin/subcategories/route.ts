import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createSubCategory,
  listSubCategories,
} from "@/server/subcategory/subcategory.service";
import { CreateSubCategorySchema } from "@/server/subcategory/subcategory.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
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
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission([
      "subcategory:read",
      "product:read",
      "product:create",
      "product:update",
    ]);

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    const data = await listSubCategories({
      page,
      limit,
      search,
      categoryId,
      all,
      sortBy,
      sortDir,
      isActive,
    });

    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
