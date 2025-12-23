import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { createRole, listRoles } from "@/server/role/role.service";
import { CreateRoleSchema } from "@/server/role/role.validation";

export async function POST(req: Request) {
  await requirePermission("role:create");

  const body = await req.json();
  const parsed = CreateRoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const role = await createRole(parsed.data);
  return NextResponse.json(role, { status: 201 });
}

export async function GET(req: Request) {
  await requirePermission("role:read");

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? undefined;

  const roles = await listRoles({ page, limit, search });
  return NextResponse.json(roles);
}
