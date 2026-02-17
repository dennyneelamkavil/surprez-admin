import "server-only";

export function mapSubCategoryForCustomerList(sub: any) {
  return {
    id: sub._id.toString(),
    name: sub.name,
    slug: sub.slug,
    image: sub.image ? { url: sub.image.url } : null,
  };
}

export function mapSubCategoryDetail(sub: any) {
  return {
    id: sub._id.toString(),
    name: sub.name,
    slug: sub.slug,
    image: sub.image ? { url: sub.image.url } : null,
    description: sub.description ?? null,

    category: sub.category
      ? {
          id: sub.category._id.toString(),
          name: sub.category.name,
          slug: sub.category.slug,
        }
      : null,

    seo: sub.seo ?? null,
  };
}
