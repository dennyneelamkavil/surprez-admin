import { NextResponse } from "next/server";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/server/user/user.service";
import { requirePermission } from "@/server/auth/rbac";
import { UpdateUserSchema } from "@/server/user/user.validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requirePermission("user:read");
  const user = await getUserById(params.id);
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("user:update");
  const body = await req.json();
  const parsed = UpdateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await updateUser(params.id, parsed.data);
  return NextResponse.json(user);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await requirePermission("user:delete");
  await deleteUser(params.id);
  return NextResponse.json({ success: true });
}
