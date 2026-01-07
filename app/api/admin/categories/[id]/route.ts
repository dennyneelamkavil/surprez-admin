import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/server/category/category.service";
import { UpdateCategorySchema } from "@/server/category/category.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("category:read");
    return NextResponse.json(await getCategoryById(id));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("category:update");

    const body = await request.json();
    const parsed = UpdateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(await updateCategory(id, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("category:delete");
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
