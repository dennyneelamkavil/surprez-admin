export function mapSeller(seller: any) {
  return {
    id: String(seller._id),

    /* ================= AUTH ================= */
    email: seller.email,
    phone: seller.phone,

    /* ================= SELLER TYPE ================= */
    sellerType: seller.sellerType,

    /* ================= BUSINESS ================= */
    businessName: seller.businessName,
    businessType: seller.businessType,
    legalName: seller.legalName,
    gstin: seller.gstin,

    businessAddress: seller.businessAddress
      ? {
          address: seller.businessAddress.address,
          city: seller.businessAddress.city,
          state: seller.businessAddress.state,
          pincode: seller.businessAddress.pincode,
          country: seller.businessAddress.country,
        }
      : null,
    bankDetails: seller.bankDetails
      ? {
          accountHolderName: seller.bankDetails.accountHolderName,
          accountNumber: seller.bankDetails.accountNumber,
          ifscCode: seller.bankDetails.ifscCode,
          bankName: seller.bankDetails.bankName,
        }
      : null,

    /* ================= STATUS ================= */
    status: seller.status,
    isActive: seller.isActive,

    /* ================= META ================= */
    lastLoginAt: seller.lastLoginAt,
    approvedAt: seller.approvedAt,
    rejectedReason: seller.rejectedReason,

    /* ================= TIMESTAMPS ================= */
    createdAt: seller.createdAt,
    updatedAt: seller.updatedAt,
  };
}
