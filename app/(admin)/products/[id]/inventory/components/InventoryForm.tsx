"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  Switch,
  AttributeEditor,
} from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import type { AttributeRow } from "@/components/form";

type Props = {
  mode: "create" | "edit";
  productId?: string;
  inventoryId?: string;
};

export default function InventoryFormClient({
  mode,
  productId,
  inventoryId,
}: Props) {
  const router = useRouter();

  const [sku, setSku] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    if (!inventoryId) return;

    try {
      const res = await fetch(`/api/admin/inventory/${inventoryId}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load product");
      const data = await res.json();

      setSku(data.sku);
      setMrp(String(data.price.mrp));
      setSellingPrice(String(data.price.sellingPrice));
      setStock(String(data.stock));
      setIsActive(data.isActive);

      if (data.attributes) {
        setAttributes(
          Object.entries(data.attributes).map(([k, v]) => ({
            id: crypto.randomUUID(),
            key: k,
            value: String(v),
          }))
        );
      }
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [inventoryId]);

  useEffect(() => {
    if (mode === "edit") fetchInventory();
  }, [mode, fetchInventory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const attributesPayload = attributes.reduce<Record<string, string>>(
      (acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      },
      {}
    );

    const payload = {
      product: productId,
      sku,
      price: {
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
      },
      stock: Number(stock),
      attributes: attributesPayload,
      isActive,
    };

    const res = await fetch(
      mode === "create"
        ? "/api/admin/inventory"
        : `/api/admin/inventory/${inventoryId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json?.error ?? "Save failed");
    }

    router.back();
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title={mode === "create" ? "Add Inventory" : "Edit Inventory"}
        backHref=".."
      />

      <div className="rounded-lg border bg-white p-6 shadow-theme-xs dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <FormError error={error} />}

            <FormField label="SKU" required>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="MRP" required>
                <Input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                />
              </FormField>

              <FormField label="Selling Price" required>
                <Input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Stock" required>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </FormField>

            <FormField label="Attributes">
              <AttributeEditor value={attributes} onChange={setAttributes} />
            </FormField>

            <FormField label="Status">
              <Switch
                label={isActive ? "Active" : "Inactive"}
                defaultChecked={isActive}
                onChange={setIsActive}
              />
            </FormField>

            <FormActions
              primaryLabel={
                mode === "create" ? "Create Inventory" : "Update Inventory"
              }
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
