export function mapProductInventory(inv: any) {
  return {
    id: String(inv._id),
    sku: inv.sku,
    barcode: inv.barcode,
    price: inv.price,
    stock: inv.stock,
    attributes: inv.attributes ?? {},
    shipping: inv.shipping,
    isActive: inv.isActive,
    product: inv.product
      ? {
          id: String(inv.product._id),
          name: inv.product.name,
          slug: inv.product.slug,
        }
      : null,
    createdAt: inv.createdAt,
    updatedAt: inv.updatedAt,
  };
}
