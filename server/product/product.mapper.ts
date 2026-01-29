export function mapProduct(product: any) {
  return {
    id: String(product._id),

    name: product.name,
    slug: product.slug,
    brand: product.brand,
    modelNumber: product.modelNumber,
    countryOfOrigin: product.countryOfOrigin,

    coverImage: product.coverImage,
    images: product.images ?? [],
    videos: product.videos ?? [],

    description: product.description,
    subcategories:
      product.subcategories?.map((sc: any) => ({
        id: String(sc._id),
        name: sc.name,
        slug: sc.slug,
      })) ?? [],

    keyFeatures: product.keyFeatures ?? [],
    ingredientsOrMaterial: product.ingredientsOrMaterial,
    usageInstructions: product.usageInstructions,
    safetyWarnings: product.safetyWarnings,

    attributes: product.attributes,

    warranty: product.warranty,
    returnPolicy: product.returnPolicy,

    compliance: product.compliance,

    rating: product.rating,
    isActive: product.isActive,
    isFeatured: product.isFeatured,

    seo: product.seo,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
