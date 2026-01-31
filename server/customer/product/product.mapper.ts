import "server-only";

export function mapProductForCustomerList(product: any) {
  const mrp = product.minMrp ?? 0;
  const selling = product.minSellingPrice ?? 0;

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    thumbnail: product.coverImage ? { url: product.coverImage.url } : null,

    price: {
      mrp,
      selling,
      discountPercent: mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0,
    },

    rating: {
      average: product.rating?.average ?? 0,
      count: product.rating?.count ?? 0,
    },

    inStock: product.totalStock > 0,
  };
}
