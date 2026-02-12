import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";

import {
  createSeller,
  listSellers,
} from "@/server/seller-management/seller.service";

import { CreateSellerSchema } from "@/server/seller-management/seller.validation";
import { handleApiError } from "@/server/errors/handleApiError";

/* ================= CREATE ================= */

export async function POST(req: Request) {
  try {
    await requirePermission("seller:create");

    const body = await req.json();
    const parsed = CreateSellerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await createSeller(parsed.data), { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= LIST ================= */

export async function GET(req: Request) {
  try {
    await requirePermission("seller:read");

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;

    const status = searchParams.get("status") ?? undefined;
    const sellerType = searchParams.get("sellerType") ?? undefined;
    const businessType = searchParams.get("businessType") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    return NextResponse.json(
      await listSellers({
        page,
        limit,
        search,
        all,
        sortBy,
        sortDir,
        status,
        sellerType,
        businessType,
        isActive,
      }),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
