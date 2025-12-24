import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "@/server/subcategory/subcategory.service";
import { UpdateSubCategorySchema } from "@/server/subcategory/subcategory.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("subcategory:read");
  return NextResponse.json(await getSubCategoryById(params.id));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("subcategory:update");

  const body = await req.json();
  const parsed = UpdateSubCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateSubCategory(params.id, parsed.data));
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("subcategory:delete");
  await deleteSubCategory(params.id);
  return NextResponse.json({ success: true });
}
