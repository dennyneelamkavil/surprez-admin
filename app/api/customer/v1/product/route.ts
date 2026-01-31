import { NextResponse } from "next/server";
import { listCustomerProducts } from "@/server/customer/product/product.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const categorySlug = searchParams.get("category") ?? undefined;
    const sortBy = searchParams.get("sortBy") as
      | "price"
      | "rating"
      | "createdAt"
      | undefined;
    const sortDir = searchParams.get("sortDir") as "asc" | "desc" | undefined;

    return NextResponse.json(
      await listCustomerProducts({
        page,
        limit,
        search,
        categorySlug,
        sortBy,
        sortDir,
      }),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
