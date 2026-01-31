import "server-only";

export function mapInventoryVariant(inv: any) {
  const mrp = inv.price?.mrp ?? 0;
  const selling = inv.price?.sellingPrice ?? 0;

  return {
    id: inv._id.toString(),
    sku: inv.sku,

    price: {
      mrp,
      selling,
      discountPercent: mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0,
      currency: inv.price?.currency ?? "INR",
    },

    stock: inv.stock,
    inStock: inv.stock > 0,

    attributes: inv.attributes ?? null,
  };
}

export function mapProductDetail(product: any, inventories: any[]) {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    modelNumber: product.modelNumber ?? null,
    countryOfOrigin: product.countryOfOrigin,

    media: {
      coverImage: product.coverImage ? { url: product.coverImage.url } : null,
      images: (product.images ?? []).map((i: any) => ({ url: i.url })),
      videos: (product.videos ?? []).map((v: any) => ({ url: v.url })),
    },

    description: product.description ?? null,
    keyFeatures: product.keyFeatures ?? [],
    ingredientsOrMaterial: product.ingredientsOrMaterial ?? null,

    attributes: product.attributes ?? null,

    policies: {
      warranty: product.warranty ?? null,
      returnPolicy: product.returnPolicy ?? null,
    },

    rating: {
      average: product.rating?.average ?? 0,
      count: product.rating?.count ?? 0,
    },

    inventories: inventories.map(mapInventoryVariant),

    seo: product.seo ?? null,
  };
}
