import { NextRequest, NextResponse } from "next/server";
import { resolveSeo } from "@/server/seo/seo.resolver";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const seo = await resolveSeo({
      type: "category",
      slug,
    });

    if (!seo) {
      return NextResponse.json({ error: "SEO not found" }, { status: 404 });
    }

    return NextResponse.json(seo);
  } catch (err) {
    return handleApiError(err);
  }
}
