import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/server/category/category.service";
import { UpdateCategorySchema } from "@/server/category/category.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("category:read");
  return NextResponse.json(await getCategoryById(params.id));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("category:update");

  const body = await req.json();
  const parsed = UpdateCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateCategory(params.id, parsed.data));
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("category:delete");
  await deleteCategory(params.id);
  return NextResponse.json({ success: true });
}
