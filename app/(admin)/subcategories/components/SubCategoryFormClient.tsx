"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/button/Button";
import FormHeader from "@/components/form/FormHeader";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import type { Media, CategoryBase } from "@/lib/types";
import { uploadMedia } from "@/lib/uploadMedia";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function SubCategoryFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<CategoryBase[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setCategories(data.categories ?? data);
  }

  const fetchSubCategory = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/subcategories/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load subcategory");
      const data = await res.json();
      setName(data.name);
      setCategory(data.category.id);
      setImage(data.image);
      setDescription(data.description ?? "");
    } catch {
      setError("Failed to load subcategory");
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
        mode === "create"
          ? "/api/admin/subcategories"
          : `/api/admin/subcategories/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            category,
            image,
            description,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push("/subcategories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchCategories();
    if (mode === "edit") fetchSubCategory();
  }, [mode, fetchSubCategory]);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <FormHeader
        title={mode === "create" ? "Create SubCategory" : "Edit SubCategory"}
        backHref="/subcategories"
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

            <FormField label="SubCategory Name" required htmlFor="name">
              <Input
                id="name"
                placeholder="Dolls, Action Figures, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </FormField>

            <FormField label="Category" required>
              <Select
                options={categoryOptions}
                value={category}
                placeholder="Select category"
                onChange={setCategory}
              />
            </FormField>

            <FormField label="Image" required htmlFor="image">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setUploading(true);
                    const media = await uploadMedia(file, "subcategories");
                    setImage(media);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              {uploading && (
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}

              {image && (
                <Image
                  src={image.url}
                  alt="SubCategory Image Preview"
                  width={50}
                  height={50}
                  className="rounded object-cover"
                />
              )}
            </FormField>

            <FormField label="Description" htmlFor="description">
              <TextArea
                placeholder="A brief description about this subcategory."
                rows={3}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving || uploading}>
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create SubCategory"
                  : "Update SubCategory"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/subcategories")}
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
