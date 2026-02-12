/**

* Seller bank details
  */
export interface SellerBankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
}

/**

* Seller business address
  */
export interface SellerBusinessAddress {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

/**

* Seller status enum
  */
export type SellerStatus = "pending" | "approved" | "suspended" | "rejected";

/**

* Seller type enum
  */
export type SellerType = "vendor" | "craft_maker";

/**

* Business structure type
  */
export type SellerBusinessType =
  | "individual"
  | "proprietorship"
  | "partnership"
  | "llp"
  | "private_limited"
  | "public_limited";

/**

* Lightweight seller reference
* Used for lists and selectors
  */
export interface SellerBase {
  id: string;
  businessName: string;
  email: string;
}

/**

* Full Seller model
* Represents populated API response
  */
export interface Seller extends SellerBase {
  phone?: string;

  sellerType: SellerType;

  businessType?: SellerBusinessType;
  legalName?: string;
  gstin?: string;

  businessAddress?: SellerBusinessAddress;

  bankDetails?: SellerBankDetails;

  status: SellerStatus;
  isActive: boolean;

  lastLoginAt?: string;
  approvedAt?: string;
  rejectedReason?: string;

  createdAt: string;
  updatedAt: string;
}
