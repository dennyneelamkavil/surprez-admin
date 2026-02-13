import "server-only";

export function mapCustomer(customer: any) {
  return {
    id: String(customer._id),
    phone: customer.phone,
    fullName: customer.fullName,
    email: customer.email,
    isActive: customer.isActive,
    lastLoginAt: customer.lastLoginAt,
    createdAt: customer.createdAt,
  };
}
