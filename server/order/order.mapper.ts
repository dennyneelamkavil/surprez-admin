export function mapOrder(order: any) {
  return {
    id: String(order._id),

    orderNumber: order.orderNumber,

    customer: order.customer
      ? {
          id: String(order.customer._id),
          phone: order.customer.phone,
          email: order.customer.email,
          fullName: order.customer.fullName,
        }
      : null,

    seller: order.seller
      ? {
          id: String(order.seller._id),
          businessName: order.seller.businessName,
          email: order.seller.email,
        }
      : null,

    items:
      order.items?.map((item: any) => ({
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

    deliveryAddress: order.deliveryAddress,

    totals: order.totals,

    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
