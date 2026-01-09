export function mapCategory(category: any) {
  return {
    id: String(category._id),
    name: category.name,
    slug: category.slug,
    image: category.image,
    description: category.description,
    isActive: category.isActive,
    seo: category.seo,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
