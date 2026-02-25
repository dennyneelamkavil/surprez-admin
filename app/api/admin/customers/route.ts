import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";

import {
  createCustomer,
  listCustomers,
} from "@/server/customer-management/customer.service";

import { CreateCustomerSchema } from "@/server/customer-management/customer.validation";
import { handleApiError } from "@/server/errors/handleApiError";

/* ================= CREATE ================= */

export async function POST(req: Request) {
  try {
    await requirePermission("customer:create");

    const body = await req.json();
    const parsed = CreateCustomerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await createCustomer(parsed.data), {
      status: 201,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= LIST ================= */

export async function GET(req: Request) {
  try {
    await requirePermission("customer:read");

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    return NextResponse.json(
      await listCustomers({
        page,
        limit,
        search,
        all,
        sortBy,
        sortDir,
        isActive,
      }),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
