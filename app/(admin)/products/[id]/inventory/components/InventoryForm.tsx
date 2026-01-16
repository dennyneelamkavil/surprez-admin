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

import { useFieldErrors, useScrollToTop } from "@/hooks";

import type { AttributeRow } from "@/components/form";

type Fields = "sku" | "stock" | "mrp" | "sellingPrice";
type Props = {
  mode: "create" | "edit";
  productId?: string;
  inventoryId?: string;
};

function isValidPriceInput(value: string) {
  return /^\d*\.?\d{0,2}$/.test(value);
}

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

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

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
          Object.entries(data.attributes).map(([key, val]) => ({
            id: crypto.randomUUID(),
            key,
            value: Array.isArray(val) ? val.join(", ") : String(val),
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

  function handleMrpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!isValidPriceInput(value)) return;

    clearFieldError("mrp");
    setError(null);
    setMrp(value);
  }

  function handleSellingPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!isValidPriceInput(value)) return;

    clearFieldError("sellingPrice");
    setError(null);
    setSellingPrice(value);
  }

  function handleStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    clearFieldError("stock");
    setError(null);
    setStock(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    let hasError = false;

    if (!sku) {
      setFieldError("sku", "SKU is required");
      hasError = true;
    }

    if (!mrp) {
      setFieldError("mrp", "MRP is required");
      hasError = true;
    }

    if (!stock) {
      setFieldError("stock", "Stock is required");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    if (!sellingPrice) {
      setSellingPrice(mrp);
    }

    const finalSellingPrice = sellingPrice || mrp;

    const attributesPayload = attributes.reduce<Record<string, string>>(
      (acc, { key, value }) => {
        if (!key || !value) return acc;

        acc[key.trim()] = value.trim();
        return acc;
      },
      {}
    );

    const payload = {
      product: productId,
      sku,
      price: {
        mrp: Number(mrp),
        sellingPrice: Number(finalSellingPrice),
      },
      stock: Number(stock),
      attributes: attributesPayload,
      isActive,
    };

    try {
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
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(
        mode === "create"
          ? `/products/${productId}/inventory`
          : `/products/${productId}/inventory/${inventoryId}`
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  return (
    <div className="space-y-6">
      <FormHeader
        title={mode === "create" ? "Add Inventory" : "Edit Inventory"}
        backHref={`/products/${productId}/inventory`}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <FormError error={error} />}

            <FormField label="SKU" required htmlFor="sku">
              <Input
                id="sku"
                value={sku}
                onChange={(e) => {
                  clearFieldError("sku");
                  setError(null);
                  setSku(e.target.value);
                }}
                error={!!fieldErrors.sku}
                hint={fieldErrors.sku}
                autoFocus
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="MRP" required htmlFor="mrp">
                <Input
                  id="mrp"
                  value={mrp}
                  onChange={handleMrpChange}
                  error={!!fieldErrors.mrp}
                  hint={fieldErrors.mrp}
                />
              </FormField>

              <FormField label="Selling Price" required htmlFor="sellingPrice">
                <Input
                  id="sellingPrice"
                  value={sellingPrice}
                  onChange={handleSellingPriceChange}
                  error={!!fieldErrors.sellingPrice}
                  hint={fieldErrors.sellingPrice}
                />
              </FormField>
            </div>

            <FormField label="Stock" required htmlFor="stock">
              <Input
                id="stock"
                value={stock}
                onChange={handleStockChange}
                error={!!fieldErrors.stock}
                hint={fieldErrors.stock}
              />
            </FormField>

            <FormField label="Attributes">
              <AttributeEditor
                value={attributes}
                onChange={setAttributes}
                config={{
                  keyPlaceholder: "Variant (e.g. color, size)",
                  valuePlaceholder: "Single value (e.g. Red, M)",
                  addButtonLabel: "+ Add Variant Attribute",
                  helperText:
                    "Used to define this SKU’s specific variant attributes.",
                }}
              />
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
                saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Inventory"
                  : "Update Inventory"
              }
              primaryDisabled={saving || hasErrors}
              backLabel="Cancel"
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
