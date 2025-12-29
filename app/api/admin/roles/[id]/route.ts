import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getRoleById,
  updateRole,
  deleteRole,
} from "@/server/role/role.service";
import { UpdateRoleSchema } from "@/server/role/role.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("role:read");
  return NextResponse.json(await getRoleById(id));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("role:update");

  const body = await request.json();
  const parsed = UpdateRoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateRole(id, parsed.data));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("role:delete");
  await deleteRole(id);
  return NextResponse.json({ success: true });
}
