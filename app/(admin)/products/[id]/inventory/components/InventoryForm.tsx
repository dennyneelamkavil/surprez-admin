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
  CollapsibleFormSection,
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
function isValidNumberInput(value: string) {
  return /^\d*\.?\d*$/.test(value);
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
  const [currency, setCurrency] = useState("INR");
  const [stock, setStock] = useState("");
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);

  const [barcode, setBarcode] = useState("");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [dimensionUnit, setDimensionUnit] = useState("cm");

  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");

  const [handlingTime, setHandlingTime] = useState("");
  const [shippingTemplate, setShippingTemplate] = useState("");

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
      setCurrency(data.price?.currency ?? "INR");
      setStock(String(data.stock));

      setBarcode(data.barcode ?? "");

      setLength(String(data.shipping?.dimensions?.length ?? ""));
      setWidth(String(data.shipping?.dimensions?.width ?? ""));
      setHeight(String(data.shipping?.dimensions?.height ?? ""));
      setDimensionUnit(data.shipping?.dimensions?.unit ?? "cm");

      setWeight(String(data.shipping?.weight?.value ?? ""));
      setWeightUnit(data.shipping?.weight?.unit ?? "kg");

      setHandlingTime(String(data.shipping?.handlingTime ?? ""));
      setShippingTemplate(data.shipping?.shippingTemplate ?? "");

      setIsActive(data.isActive);

      if (data.attributes) {
        setAttributes(
          Object.entries(data.attributes).map(([key, val]) => ({
            id: crypto.randomUUID(),
            key,
            value: Array.isArray(val) ? val.join(", ") : String(val),
          })),
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

  function handleNumberChange(
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isValidNumberInput(value)) return;
      setter(value);
    };
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
      {},
    );

    const payload = {
      product: productId,
      sku,
      barcode,
      price: {
        mrp: Number(mrp),
        sellingPrice: Number(finalSellingPrice),
        currency,
      },
      stock: Number(stock),
      attributes: attributesPayload,
      shipping: {
        dimensions:
          length || width || height
            ? {
                length: Number(length),
                width: Number(width),
                height: Number(height),
                unit: dimensionUnit,
              }
            : undefined,
        weight: weight
          ? {
              value: Number(weight),
              unit: weightUnit,
            }
          : undefined,
        handlingTime: Number(handlingTime),
        shippingTemplate,
      },
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
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(
        mode === "create"
          ? `/products/${productId}/inventory`
          : `/products/${productId}/inventory/${inventoryId}`,
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
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <FormField label="Barcode">
                <Input
                  placeholder="EAN / UPC / ISBN"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField label="MRP" required htmlFor="mrp">
                <Input
                  id="mrp"
                  value={mrp}
                  inputMode="decimal"
                  onChange={handleMrpChange}
                  error={!!fieldErrors.mrp}
                  hint={fieldErrors.mrp}
                />
              </FormField>

              <FormField label="Selling Price" required htmlFor="sellingPrice">
                <Input
                  id="sellingPrice"
                  value={sellingPrice}
                  inputMode="decimal"
                  onChange={handleSellingPriceChange}
                  error={!!fieldErrors.sellingPrice}
                  hint={fieldErrors.sellingPrice}
                />
              </FormField>

              <FormField label="Currency">
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  placeholder="INR"
                />
              </FormField>
            </div>

            <FormField label="Stock" required htmlFor="stock">
              <Input
                id="stock"
                value={stock}
                onChange={handleStockChange}
                inputMode="decimal"
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

            <CollapsibleFormSection
              title="Shipping Information"
              description="Package size, weight, and handling details."
              collapsible
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Length (cm)">
                  <Input
                    value={length}
                    inputMode="decimal"
                    onChange={handleNumberChange(setLength)}
                  />
                </FormField>

                <FormField label="Width (cm)">
                  <Input
                    value={width}
                    inputMode="decimal"
                    onChange={handleNumberChange(setWidth)}
                  />
                </FormField>

                <FormField label="Height (cm)">
                  <Input
                    value={height}
                    inputMode="decimal"
                    onChange={handleNumberChange(setHeight)}
                  />
                </FormField>

                <FormField label="Weight (kg)">
                  <Input
                    value={weight}
                    inputMode="decimal"
                    onChange={handleNumberChange(setWeight)}
                  />
                </FormField>

                <FormField label="Handling Time (days)">
                  <Input
                    value={handlingTime}
                    inputMode="decimal"
                    onChange={handleNumberChange(setHandlingTime)}
                  />
                </FormField>

                <FormField label="Shipping Template">
                  <Input
                    placeholder="Standard / Express"
                    value={shippingTemplate}
                    onChange={(e) => setShippingTemplate(e.target.value)}
                  />
                </FormField>
              </div>
            </CollapsibleFormSection>

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
