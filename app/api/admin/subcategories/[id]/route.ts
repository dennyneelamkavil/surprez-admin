import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "@/server/subcategory/subcategory.service";
import { UpdateSubCategorySchema } from "@/server/subcategory/subcategory.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("subcategory:read");
  return NextResponse.json(await getSubCategoryById(id));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("subcategory:delete");
  await deleteSubCategory(id);
  return NextResponse.json({ success: true });
}
