export function mapCart(cart: any) {
  return {
    id: String(cart._id),
    customer: String(cart.customer),

    items:
      cart.items?.map((item: any) => ({
        product: {
          id: String(item.product?._id),
          name: item.product?.name,
        },
        inventory: {
          id: String(item.inventory?._id),
          sku: item.inventory?.sku,
        },
        quantity: item.quantity,
        price: item.price,
      })) ?? [],

    totals: cart.totals,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}
