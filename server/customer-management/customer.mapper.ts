export function mapCustomer(customer: any) {
  return {
    id: String(customer._id),

    phone: customer.phone,
    email: customer.email,
    fullName: customer.fullName,

    wishlist: customer.wishlist ?? [],

    addresses:
      customer.addresses?.map((addr: any) => ({
        id: String(addr._id),
        name: addr.name,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        country: addr.country,
        isDefault: addr.isDefault,
        createdAt: addr.createdAt,
        updatedAt: addr.updatedAt,
      })) ?? [],

    isActive: customer.isActive,
    lastLoginAt: customer.lastLoginAt,

    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  };
}
