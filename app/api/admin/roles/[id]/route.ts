import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getRoleById,
  updateRole,
  deleteRole,
} from "@/server/role/role.service";
import { UpdateRoleSchema } from "@/server/role/role.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("role:read");
  return NextResponse.json(await getRoleById(params.id));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("role:update");

  const body = await req.json();
  const parsed = UpdateRoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateRole(params.id, parsed.data));
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("role:delete");
  await deleteRole(params.id);
  return NextResponse.json({ success: true });
}
