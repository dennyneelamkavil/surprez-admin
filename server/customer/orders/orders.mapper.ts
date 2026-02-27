import "server-only";

export function mapCustomerOrder(order: any) {
  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    seller: order.seller,
    items: order.items.map((i: any) => ({
      product: i.product,
      inventory: i.inventory,
      quantity: i.quantity,
      price: i.price,
    })),
    totals: order.totals,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
  };
}
