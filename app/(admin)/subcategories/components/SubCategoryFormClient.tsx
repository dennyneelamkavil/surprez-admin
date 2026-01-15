"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Authorized } from "@/components/auth/Authorized";

import FormHeader from "@/components/form/FormHeader";
import FormField from "@/components/form/FormField";
import FormError from "@/components/form/FormError";
import FormActions from "@/components/form/FormActions";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Switch from "@/components/form/switch/Switch";
import Select from "@/components/form/Select";
import FormSEOSection from "@/components/form/FormSEOSection";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { uploadMedia } from "@/lib/uploadMedia";
import { formatSlug } from "@/lib/utils";
import type { Media, CategoryBase, Seo } from "@/lib/types";

type Fields = "name" | "slug" | "image" | "category";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function SubCategoryFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [seo, setSeo] = useState<Seo>({});
  const [uploadingSeoImg, setUploadingSeoImg] = useState(false);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<CategoryBase[]>([]);

  const [image, setImage] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories?all=true", {
      cache: "no-store",
    });
    const json = await res.json();
    setCategories(json.data);
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
      setSlug(data.slug);
      setCategory(data.category.id);
      setImage(data.image);
      setDescription(data.description ?? "");
      setSeo(data.seo ?? {});
      setIsActive(data.isActive);
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load subcategory");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
    if (mode === "edit") fetchSubCategory();
  }, [mode, fetchSubCategory]);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(formatSlug(e.target.value));
  };

  async function handleUploadOgImage(file: File) {
    setUploadingSeoImg(true);
    try {
      return await uploadMedia(file, "temp/seo");
    } finally {
      setUploadingSeoImg(false);
    }
  }

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

    if (!category) {
      setFieldError("category", "Category is required");
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
          ? "/api/admin/subcategories"
          : `/api/admin/subcategories/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            slug,
            category,
            image,
            description,
            seo,
            isActive,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(`/subcategories/${id}/view`);
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
        title={mode === "create" ? "Create SubCategory" : "Edit SubCategory"}
        backHref="/subcategories"
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="SubCategory Name" required htmlFor="name">
                <Input
                  id="name"
                  placeholder="Dolls, Action Figures, etc."
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

              <FormField label="Category" required>
                <Select
                  options={categoryOptions}
                  value={category}
                  placeholder="Select category"
                  onChange={(value) => {
                    clearFieldError("category");
                    setError(null);
                    setCategory(value);
                  }}
                  error={!!fieldErrors.category}
                  hint={fieldErrors.category}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Image" required htmlFor="image">
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
                        const media = await uploadMedia(
                          file,
                          "temp/subcategories"
                        );
                        setImage(media);
                      } catch (err: any) {
                        setFieldError("image", err.message ?? "Upload failed");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading image...</p>
                  )}
                </FormField>

                {image && (
                  <Image
                    src={image.url}
                    alt="SubCategory preview"
                    width={120}
                    height={120}
                    className="rounded object-cover border dark:border-gray-800"
                  />
                )}
              </div>

              {image && (
                <div className="space-y-4">
                  <FormField label="Image Alt Text">
                    <Input
                      placeholder="e.g. Dolls, Action Figures, etc."
                      value={image.alt ?? ""}
                      onChange={(e) =>
                        setImage((prev) =>
                          prev ? { ...prev, alt: e.target.value } : prev
                        )
                      }
                      hint="Describe the image for SEO & accessibility"
                    />
                  </FormField>

                  <FormField label="Image Caption (optional)">
                    <Input
                      placeholder="Optional caption shown below the image"
                      value={image.caption ?? ""}
                      onChange={(e) =>
                        setImage((prev) =>
                          prev ? { ...prev, caption: e.target.value } : prev
                        )
                      }
                    />
                  </FormField>
                </div>
              )}
            </div>

            <FormField label="Description" htmlFor="description">
              <TextArea
                rows={3}
                placeholder="A brief description about this subcategory."
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="SubCategory Status">
                <Switch
                  label={isActive ? "Active" : "Inactive"}
                  defaultChecked={isActive}
                  onChange={setIsActive}
                />
              </FormField>
            </div>

            <Authorized
              permission={mode === "create" ? "seo:create" : "seo:update"}
            >
              <FormSEOSection
                value={seo}
                onChange={setSeo}
                uploading={uploadingSeoImg}
                onUploadOgImage={handleUploadOgImage}
                collapsible
                defaultOpen={false}
              />
            </Authorized>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create SubCategory"
                  : "Update SubCategory"
              }
              primaryDisabled={saving || uploading || hasErrors}
              backLabel="Cancel"
              onBack={() => router.push(`/subcategories/${id}/view`)}
            />
          </form>
        )}
      </div>
    </div>
  );
}
