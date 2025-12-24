export function mapProduct(product: any) {
  return {
    id: String(product._id),
    name: product.name,
    slug: product.slug,
    coverImage: product.coverImage,
    images: product.images,
    videos: product.videos,
    description: product.description,
    attributes: product.attributes,
    rating: product.rating,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    subcategories:
      product.subcategories?.map((sc: any) => ({
        id: String(sc._id),
        name: sc.name,
        slug: sc.slug,
      })) ?? [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
