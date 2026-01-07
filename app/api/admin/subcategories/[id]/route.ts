import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "@/server/subcategory/subcategory.service";
import { UpdateSubCategorySchema } from "@/server/subcategory/subcategory.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requirePermission("subcategory:read");
    return NextResponse.json(await getSubCategoryById(id));
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
    await requirePermission("subcategory:update");

    const body = await request.json();
    const parsed = UpdateSubCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(await updateSubCategory(id, parsed.data));
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
    await requirePermission("subcategory:delete");
    await deleteSubCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
