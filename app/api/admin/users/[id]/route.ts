import { NextRequest, NextResponse } from "next/server";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/server/user/user.service";
import { requirePermission } from "@/server/auth/rbac";
import { UpdateUserSchema } from "@/server/user/user.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("user:read");
  const user = await getUserById(id);
  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("user:update");
  const body = await request.json();
  const parsed = UpdateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await updateUser(id, parsed.data);
  return NextResponse.json(user);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await requirePermission("user:delete");
  await deleteUser(id);
  return NextResponse.json({ success: true });
}
