import "server-only";

export function mapCategoryForCustomerList(category: any) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    image: category.image ? { url: category.image.url } : null,
    description: category.description ?? null,
  };
}

export function mapCategoryDetail(category: any, subcategories: any[]) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    image: category.image ? { url: category.image.url } : null,
    description: category.description ?? null,

    subcategories: subcategories.map((sub) => ({
      id: sub._id.toString(),
      name: sub.name,
      slug: sub.slug,
      image: sub.image ? { url: sub.image.url } : null,
    })),

    seo: category.seo ?? null,
  };
}
