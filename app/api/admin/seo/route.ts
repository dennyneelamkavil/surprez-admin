import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createPageSeo,
  listPageSeos,
} from "@/server/page-seo/page-seo.service";
import { CreatePageSeoSchema } from "@/server/page-seo/page-seo.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("seo:create");

    const body = await req.json();
    const parsed = CreatePageSeoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const pageSeo = await createPageSeo(parsed.data);
    return NextResponse.json(pageSeo, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission("seo:read");

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;

    const pageSeos = await listPageSeos({
      page,
      limit,
      search,
      all,
      sortBy,
      sortDir,
      isActive,
    });

    return NextResponse.json(pageSeos);
  } catch (err) {
    return handleApiError(err);
  }
}
