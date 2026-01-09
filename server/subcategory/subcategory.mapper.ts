export function mapSubCategory(subCategory: any) {
  return {
    id: String(subCategory._id),
    name: subCategory.name,
    slug: subCategory.slug,
    image: subCategory.image,
    description: subCategory.description,
    isActive: subCategory.isActive,
    category: subCategory.category
      ? {
          id: String(subCategory.category._id),
          name: subCategory.category.name,
          slug: subCategory.category.slug,
        }
      : null,
    seo: subCategory.seo,
    createdAt: subCategory.createdAt,
    updatedAt: subCategory.updatedAt,
  };
}
