"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/button/Button";
import FormHeader from "@/components/form/FormHeader";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function CategoryFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load category");

      const data = await res.json();
      setName(data.name);
      setImage(data.image);
      setDescription(data.description ?? "");
    } catch {
      setError("Failed to load category");
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
          ? "/api/admin/categories"
          : `/api/admin/categories/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            image,
            description,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push("/categories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (mode === "edit") fetchCategory();
  }, [mode, fetchCategory]);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <FormHeader
        title={mode === "create" ? "Create Category" : "Edit Category"}
        backHref="/categories"
      />

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

            <FormField label="Category Name" required htmlFor="name">
              <Input
                id="name"
                placeholder="Toys"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Image" required htmlFor="image">
              <Input
                id="image"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Description" htmlFor="description">
              <TextArea
                placeholder="A brief description about this category."
                rows={3}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Category"
                  : "Update Category"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/categories")}
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
