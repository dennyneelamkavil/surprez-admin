"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import FormHeader from "@/components/form/FormHeader";
import FormField from "@/components/form/FormField";
import FormError from "@/components/form/FormError";
import FormActions from "@/components/form/FormActions";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Switch from "@/components/form/switch/Switch";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors } from "@/hooks/useFieldErrors";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import { uploadMedia } from "@/lib/uploadMedia";
import { formatSlug } from "@/lib/utils";
import type { Media } from "@/lib/types";

type Fields = "name" | "slug" | "image";
type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function CategoryFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();
  useScrollToTop(error || fieldErrors);

  const fetchCategory = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load category");

      const data = await res.json();
      setName(data.name);
      setSlug(data.slug);
      setImage(data.image);
      setDescription(data.description ?? "");
      setIsActive(data.isActive);
    } catch (error: any) {
      setEditError(error.message ?? "Failed to load category");
    } finally {
      setLoading(false);
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    let hasError = false;
    if (!name) {
      setFieldError("name", "Name is required");
      hasError = true;
    }
    if (mode === "edit" && !slug) {
      setFieldError("slug", "Slug is required");
      hasError = true;
    }
    if (!image) {
      setFieldError("image", "Image is required");
      hasError = true;
    }
    if (hasError) {
      setSaving(false);
      return;
    }

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
            slug,
            image,
            description,
            isActive,
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatSlug(e.target.value);
    setSlug(value);
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

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
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <FormError error={error} />}

            <FormField label="Category Name" required htmlFor="name">
              <Input
                id="name"
                placeholder="Toys"
                value={name}
                onChange={(e) => {
                  clearFieldError("name");
                  setError(null);
                  setName(e.target.value);
                }}
                error={!!fieldErrors.name}
                hint={fieldErrors.name}
                autoFocus
              />
            </FormField>

            {mode === "edit" && (
              <FormField label="Slug" required htmlFor="slug">
                <Input
                  id="slug"
                  placeholder="toys"
                  value={slug}
                  onChange={(e) => {
                    clearFieldError("slug");
                    setError(null);
                    handleSlugChange(e);
                  }}
                  error={!!fieldErrors.slug}
                  hint={fieldErrors.slug}
                />
              </FormField>
            )}

            <FormField label="Image" required htmlFor="image">
              <div className="flex items-center gap-4">
                {/* Left: input + uploading text */}
                <div className="flex flex-col gap-2">
                  <FileInput
                    id="image"
                    accept="image/*"
                    error={!!fieldErrors.image}
                    hint={fieldErrors.image}
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        setUploading(true);
                        clearFieldError("image");
                        setError(null);
                        const media = await uploadMedia(file, "categories");
                        setImage(media);
                      } catch (err: any) {
                        setFieldError("image", err.message ?? "Upload failed");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />

                  {uploading && (
                    <p className="text-sm text-gray-500 mt-1">
                      Uploading image...
                    </p>
                  )}
                </div>

                {/* Right: image preview */}
                {image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={image.url}
                      alt="Category Image Preview"
                      width={50}
                      height={50}
                      className="rounded object-cover border"
                    />
                  </div>
                )}
              </div>
            </FormField>

            <FormField label="Description" htmlFor="description">
              <TextArea
                placeholder="A brief description about this category."
                rows={3}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <FormField label="Category Status">
              <Switch
                label={isActive ? "Active" : "Inactive"}
                defaultChecked={isActive}
                onChange={setIsActive}
              />
            </FormField>

            {/* Actions */}
            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Category"
                  : "Update Category"
              }
              primaryDisabled={saving || uploading || hasErrors}
              backLabel="Cancel"
              onBack={() => router.push("/categories")}
            />
          </form>
        )}
      </div>
    </div>
  );
}
