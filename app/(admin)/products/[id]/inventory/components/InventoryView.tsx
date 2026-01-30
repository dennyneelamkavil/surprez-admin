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

import type { ProductInventory } from "@/lib/types";

type Props = {
  productId?: string;
  inventoryId: string;
};

export default function InventoryViewClient({ productId, inventoryId }: Props) {
  const router = useRouter();
  const {
    data: inventory,
    loading,
    error,
  } = useAdminEntity<ProductInventory>({
    endpoint: "inventory",
    id: inventoryId,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Inventory" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !inventory ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <ViewField
                  label="MRP"
                  value={`${inventory.price.currency ?? "INR"} ${inventory.price.mrp}`}
                  mono
                />
                <ViewField
                  label="Selling Price"
                  value={`${inventory.price.currency ?? "INR"} ${inventory.price.sellingPrice}`}
                  mono
                />
                <ViewField
                  label="Selling Price"
                  value={`₹${inventory.price.sellingPrice}`}
                  mono
                />
                <ViewField label="Stock" value={String(inventory.stock)} />
                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={inventory.isActive ? "Active" : "Inactive"}
                    variant={inventory.isActive ? "success" : "danger"}
                  />
                </div>
              </div>
            </div>

            {inventory.barcode && (
              <ViewField label="Barcode" value={inventory.barcode} mono />
            )}

            {inventory.attributes && (
              <ViewSection title="Attributes">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(inventory.attributes).map(([key, val]) => (
                    <div
                      key={key}
                      className="rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
                    >
                      <p className="text-xs text-gray-500 dark:text-white/60 uppercase tracking-wide">
                        {key}
                      </p>
                      <p className="font-mono text-gray-900 dark:text-white">
                        {Array.isArray(val) ? val.join(", ") : val}
                      </p>
                    </div>
                  ))}
                </div>
              </ViewSection>
            )}

            {inventory.shipping && (
              <CollapsibleViewSection
                title="Shipping Information"
                description="Package size, weight, and handling details."
                collapsible
              >
                <ViewSection>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Dimensions */}
                    {inventory.shipping.dimensions && (
                      <ViewField
                        label="Dimensions"
                        value={`${inventory.shipping.dimensions.length ?? "-"} × ${
                          inventory.shipping.dimensions.width ?? "-"
                        } × ${inventory.shipping.dimensions.height ?? "-"} ${
                          inventory.shipping.dimensions.unit ?? "cm"
                        }`}
                        mono
                      />
                    )}

                    {/* Weight */}
                    {inventory.shipping.weight && (
                      <ViewField
                        label="Weight"
                        value={`${inventory.shipping.weight.value ?? "-"} ${
                          inventory.shipping.weight.unit ?? "kg"
                        }`}
                        mono
                      />
                    )}

                    {/* Handling Time */}
                    <ViewField
                      label="Handling Time"
                      value={`${inventory.shipping.handlingTime} day(s)`}
                    />

                    {/* Shipping Template */}
                    {inventory.shipping.shippingTemplate && (
                      <ViewField
                        label="Shipping Template"
                        value={inventory.shipping.shippingTemplate}
                      />
                    )}
                  </div>
                </ViewSection>
              </CollapsibleViewSection>
            )}

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(inventory.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(inventory.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Inventory"
              primaryPermission="inventory:update"
              onPrimary={() =>
                router.push(
                  `/products/${productId}/inventory/${inventoryId}/edit`,
                )
              }
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
