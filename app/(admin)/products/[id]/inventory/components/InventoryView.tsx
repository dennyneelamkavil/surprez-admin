"use client";

import { ViewField, ViewSection, ViewBadge } from "@/components/view";
import { FormHeader } from "@/components/form";
import { useAdminEntity } from "@/hooks";

import type { ProductInventory } from "@/lib/types";

type Props = {
  inventoryId: string;
};

export default function InventoryViewClient({ inventoryId }: Props) {
  const { data, loading, error } = useAdminEntity<ProductInventory>({
    endpoint: "inventory",
    id: inventoryId,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Inventory" backHref=".." />

      <ViewSection>
        {loading || error || !data ? null : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ViewField label="SKU" value={data.sku} mono />
            <ViewField label="MRP" value={`₹${data.price.mrp}`} mono />
            <ViewField
              label="Selling Price"
              value={`₹${data.price.sellingPrice}`}
              mono
            />
            <ViewField label="Stock" value={String(data.stock)} />
            <ViewBadge
              label={data.isActive ? "Active" : "Inactive"}
              variant={data.isActive ? "success" : "danger"}
            />
          </div>
        )}
      </ViewSection>

      {data?.attributes && (
        <ViewSection title="Attributes">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(data.attributes).map(([k, v]) => (
              <ViewField key={k} label={k} value={String(v)} />
            ))}
          </div>
        </ViewSection>
      )}
    </div>
  );
}
