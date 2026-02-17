import { NextRequest, NextResponse } from "next/server";
import { getCustomerProductDetail } from "@/server/customer/product/product.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    return NextResponse.json(await getCustomerProductDetail(slug));
  } catch (err) {
    return handleApiError(err);
  }
}
