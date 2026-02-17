import { NextRequest, NextResponse } from "next/server";
import { getCustomerSubCategoryDetail } from "@/server/customer/subcategory/subcategory.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const sortBy = searchParams.get("sortBy") as
      | "price"
      | "rating"
      | "createdAt"
      | undefined;
    const sortDir = searchParams.get("sortDir") as "asc" | "desc" | undefined;

    return NextResponse.json(
      await getCustomerSubCategoryDetail(slug, {
        page,
        limit,
        sortBy,
        sortDir,
      }),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
