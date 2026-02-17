import { NextResponse } from "next/server";
import { listCustomerSubCategories } from "@/server/customer/subcategory/subcategory.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") ?? undefined;

    return NextResponse.json(await listCustomerSubCategories({ categorySlug }));
  } catch (err) {
    return handleApiError(err);
  }
}
