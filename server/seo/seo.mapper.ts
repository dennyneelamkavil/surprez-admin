import "server-only";

import type { ResolvedSeo } from "./seo.types";

type MapSeoInput = {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    noIndex?: boolean;
    ogImage?: { url: string };
  };
  fallback: {
    title: string;
    description?: string;
    imageUrl?: string;
    slug: string;
    canonicalBase: string;
  };
};

export function mapSeo({ seo, fallback }: MapSeoInput): ResolvedSeo {
  return {
    title: seo?.title ?? fallback.title,
    description: seo?.description ?? fallback.description?.slice(0, 160),
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${fallback.canonicalBase}/${fallback.slug}`,
    noIndex: seo?.noIndex,
    ogImage: seo?.ogImage
      ? { url: seo.ogImage.url }
      : fallback.imageUrl
      ? { url: fallback.imageUrl }
      : undefined,
  };
}
