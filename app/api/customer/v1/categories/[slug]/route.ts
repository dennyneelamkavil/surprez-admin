import { NextRequest, NextResponse } from "next/server";
import { getCustomerCategoryDetail } from "@/server/customer/category/category-detail.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    return NextResponse.json(await getCustomerCategoryDetail(slug));
  } catch (err) {
    return handleApiError(err);
  }
}
