"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {mode === "create" ? "Create Product" : "Edit Product"}
        </h1>

        <Link
          href="/products"
          className="text-sm text-brand-500 hover:underline"
        >
          Back to list
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Dolls, Action Figures, etc."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                SubCategories
              </label>
              <select
                value={subcategories}
                onChange={(e) => setSubcategories(e.target.value.split(","))}
                multiple
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select subcategories</option>
                {subcats.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="A brief description about this product."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
              </button>

              <Link
                href="/products"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
