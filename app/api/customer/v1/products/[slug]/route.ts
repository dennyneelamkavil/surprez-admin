import { NextResponse } from "next/server";
import { getCustomerProductDetail } from "@/server/customer/product/product-detail.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    return NextResponse.json(await getCustomerProductDetail(params.slug));
  } catch (err) {
    return handleApiError(err);
  }
}
