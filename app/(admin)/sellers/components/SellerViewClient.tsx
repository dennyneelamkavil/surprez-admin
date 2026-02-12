"use client";

import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  CollapsibleViewSection,
  ViewActions,
  ViewBadge,
  ViewField,
  ViewSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Seller } from "@/lib/types";

type Props = {
  id: string;
};

export default function SellerViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: seller,
    loading,
    error,
  } = useAdminEntity<Seller>({
    endpoint: "sellers",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Seller" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !seller ? null : (
          <div className="space-y-6">
            {/* Sticky Summary Header */}
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <ViewField
                  label="Business Name"
                  value={seller.businessName}
                  mono
                />

                <ViewField label="Email" value={seller.email} mono />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={seller.status}
                    variant={
                      seller.status === "approved"
                        ? "success"
                        : seller.status === "rejected"
                          ? "danger"
                          : seller.status === "suspended"
                            ? "warning"
                            : "info"
                    }
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Account Status</p>
                  <ViewBadge
                    label={seller.isActive ? "Active" : "Inactive"}
                    variant={seller.isActive ? "success" : "danger"}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <ViewSection title="Contact Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField label="Email" value={seller.email} mono />
                {seller.phone && (
                  <ViewField label="Phone" value={seller.phone} />
                )}
              </div>
            </ViewSection>

            {/* Business Details */}
            <ViewSection title="Business Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ViewField
                  label="Seller Type"
                  value={
                    seller.sellerType === "craft_maker"
                      ? "Craft Maker"
                      : "Vendor"
                  }
                />

                {seller.businessType && (
                  <ViewField
                    label="Business Type"
                    value={seller.businessType}
                  />
                )}

                {seller.legalName && (
                  <ViewField label="Legal Name" value={seller.legalName} />
                )}

                {seller.gstin && (
                  <ViewField label="GSTIN" value={seller.gstin} mono />
                )}
              </div>
            </ViewSection>

            {/* Address */}
            {seller.businessAddress && (
              <CollapsibleViewSection title="Business Address" collapsible>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {seller.businessAddress.address && (
                    <ViewField
                      label="Address"
                      value={seller.businessAddress.address}
                    />
                  )}

                  {seller.businessAddress.city && (
                    <ViewField
                      label="City"
                      value={seller.businessAddress.city}
                    />
                  )}

                  {seller.businessAddress.state && (
                    <ViewField
                      label="State"
                      value={seller.businessAddress.state}
                    />
                  )}

                  {seller.businessAddress.pincode && (
                    <ViewField
                      label="Pincode"
                      value={seller.businessAddress.pincode}
                    />
                  )}

                  <ViewField
                    label="Country"
                    value={seller.businessAddress.country}
                  />
                </div>
              </CollapsibleViewSection>
            )}

            {/* Bank Details */}
            {seller.bankDetails && (
              <CollapsibleViewSection title="Bank Details" collapsible>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {seller.bankDetails.accountHolderName && (
                    <ViewField
                      label="Account Holder"
                      value={seller.bankDetails.accountHolderName}
                    />
                  )}

                  {seller.bankDetails.accountNumber && (
                    <ViewField
                      label="Account Number"
                      value={seller.bankDetails.accountNumber}
                      mono
                    />
                  )}

                  {seller.bankDetails.ifscCode && (
                    <ViewField
                      label="IFSC Code"
                      value={seller.bankDetails.ifscCode}
                      mono
                    />
                  )}

                  {seller.bankDetails.bankName && (
                    <ViewField
                      label="Bank Name"
                      value={seller.bankDetails.bankName}
                    />
                  )}
                </div>
              </CollapsibleViewSection>
            )}

            {/* Status Metadata */}
            {(seller.approvedAt || seller.rejectedReason) && (
              <ViewSection title="Approval Metadata">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {seller.approvedAt && (
                    <ViewField
                      label="Approved At"
                      value={new Date(seller.approvedAt).toLocaleString()}
                      mono
                    />
                  )}

                  {seller.rejectedReason && (
                    <ViewField
                      label="Rejection Reason"
                      value={seller.rejectedReason}
                    />
                  )}
                </div>
              </ViewSection>
            )}

            {/* Timestamps */}
            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(seller.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(seller.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Seller"
              primaryPermission="seller:update"
              onPrimary={() => router.push(`/sellers/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
