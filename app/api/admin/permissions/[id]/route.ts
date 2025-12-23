import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getPermissionById,
  updatePermission,
  deletePermission,
} from "@/server/permission/permission.service";
import { UpdatePermissionSchema } from "@/server/permission/permission.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("permission:read");
  return NextResponse.json(await getPermissionById(params.id));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("permission:update");

  const body = await req.json();
  const parsed = UpdatePermissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updatePermission(params.id, parsed.data));
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("permission:delete");
  await deletePermission(params.id);
  return NextResponse.json({ success: true });
}
