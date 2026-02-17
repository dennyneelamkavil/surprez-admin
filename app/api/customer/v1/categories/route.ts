import { NextResponse } from "next/server";
import { listCustomerCategories } from "@/server/customer/category/category.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET() {
  try {
    return NextResponse.json(await listCustomerCategories());
  } catch (err) {
    return handleApiError(err);
  }
}
