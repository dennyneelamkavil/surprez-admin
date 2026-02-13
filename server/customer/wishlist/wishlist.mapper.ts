import "server-only";

export function mapWishlistProduct(product: any) {
  return {
    id: String(product._id),
    name: product.name,
    slug: product.slug,
    thumbnail: product.coverImage ? { url: product.coverImage.url } : null,
  };
}
