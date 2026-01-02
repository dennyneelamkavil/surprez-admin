"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FormField from "@/components/form/FormField";
import MultiSelect from "@/components/form/MultiSelect";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import FormHeader from "@/components/form/FormHeader";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

type SubCategory = {
  id: string;
  name: string;
};

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function ProductFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [subcats, setSubcats] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSubCategories() {
    const res = await fetch("/api/admin/subcategories?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setSubcats(data.subcategories ?? data);
  }

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load product");
      const data = await res.json();
      setName(data.name);
      setCoverImage(data.coverImage);
      setImages(data.images);
      setSubcategories(data.subcategories.map((sub: any) => sub.id));
      setDescription(data.description ?? "");
      setIsFeatured(data.isFeatured);
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            coverImage,
            images,
            subcategories,
            description,
            isFeatured,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchSubCategories();
    if (mode === "edit") fetchProduct();
  }, [mode, fetchProduct]);

  const subCategoryOptions = subcats.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }));

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <FormHeader
        title={mode === "create" ? "Create Product" : "Edit Product"}
        backHref="/products"
      />

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10">
                {error}
              </div>
            )}

            <FormField label="Product Name" required htmlFor="name">
              <Input
                id="name"
                placeholder="Dolls, Action Figures, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </FormField>

            <FormField label="SubCategories" required>
              <MultiSelect
                options={subCategoryOptions}
                value={subcategories}
                onChange={setSubcategories}
                placeholder="Select subcategories"
              />
            </FormField>

            <FormField label="Cover Image" required htmlFor="coverImage">
              <Input
                id="coverImage"
                placeholder="Image URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Description" htmlFor="description">
              <TextArea
                placeholder="A brief description about this product."
                rows={3}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <FormField label="Featured">
              <Switch
                label="Mark as featured product"
                defaultChecked={isFeatured}
                onChange={setIsFeatured}
              />
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
