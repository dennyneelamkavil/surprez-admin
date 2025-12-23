import { NextResponse } from "next/server";
import { createUser, listUsers } from "@/server/user/user.service";
import { requirePermission } from "@/server/auth/rbac";
import { CreateUserSchema } from "@/server/user/user.validation";

export async function POST(req: Request) {
  await requirePermission("user:create");
  const body = await req.json();
  const parsed = CreateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await createUser(parsed.data);
  return NextResponse.json(user, { status: 201 });
}

export async function GET(req: Request) {
  await requirePermission("user:read");

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? undefined;

  const users = await listUsers({ page, limit, search });
  return NextResponse.json(users);
}
