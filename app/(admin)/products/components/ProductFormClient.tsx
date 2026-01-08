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
import MultiSelect from "@/components/form/MultiSelect";
import Switch from "@/components/form/switch/Switch";
import AttributeEditor from "@/components/form/AttributeEditor";
import Dropzone from "@/components/form/form-elements/DropZone";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors } from "@/hooks/useFieldErrors";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import { uploadMedia } from "@/lib/uploadMedia";
import { formatSlug } from "@/lib/utils";
import type { Media, SubCategoryBase } from "@/lib/types";
import type { AttributeRow } from "@/components/form/AttributeEditor";

type Fields = "name" | "slug" | "coverImage" | "subcategories";
type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function ProductFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState<Media | null>(null);
  const [images, setImages] = useState<Media[]>([]);
  const [videos, setVideos] = useState<Media[]>([]);
  const [uploading, setUploading] = useState({
    cover: false,
    images: false,
    videos: false,
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [subcats, setSubcats] = useState<SubCategoryBase[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();
  useScrollToTop(error || fieldErrors);

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
      setSlug(data.slug);
      setCoverImage(data.coverImage);
      setImages(data.images);
      setVideos(data.videos);
      setSubcategories(data.subcategories.map((sub: any) => sub.id));
      setDescription(data.description ?? "");
      setIsFeatured(data.isFeatured);
      if (data.attributes) {
        setAttributes(
          Object.entries(data.attributes).map(([key, val]) => ({
            id: crypto.randomUUID(),
            key,
            value: Array.isArray(val) ? val.join(", ") : String(val),
          }))
        );
      }
      setIsActive(data.isActive);
    } catch (error: any) {
      setEditError(error.message ?? "Failed to load product");
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
    if (!subcategories.length) {
      setFieldError("subcategories", "SubCategories is required");
      hasError = true;
    }
    if (mode === "edit" && !slug) {
      setFieldError("slug", "Slug is required");
      hasError = true;
    }
    if (!coverImage) {
      setFieldError("coverImage", "Cover Image is required");
      hasError = true;
    }
    if (hasError) {
      setSaving(false);
      return;
    }

    const attributesPayload = attributes.reduce<Record<string, any>>(
      (acc, { key, value }) => {
        if (!key) return acc;

        acc[key] = value.includes(",")
          ? value.split(",").map((v) => v.trim())
          : value;

        return acc;
      },
      {}
    );

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
            slug,
            coverImage,
            images,
            videos,
            subcategories,
            description,
            isFeatured,
            attributes: attributesPayload,
            isActive,
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatSlug(e.target.value);
    setSlug(value);
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

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
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <FormError error={error} />}

            <FormField label="Product Name" required htmlFor="name">
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

            <FormField label="SubCategories" required>
              <MultiSelect
                options={subCategoryOptions}
                value={subcategories}
                placeholder="Select subcategories"
                onChange={(e) => {
                  clearFieldError("subcategories");
                  setError(null);
                  setSubcategories(e);
                }}
                error={!!fieldErrors.subcategories}
                hint={fieldErrors.subcategories}
              />
            </FormField>

            <FormField label="Cover Image" required htmlFor="coverImage">
              <div className="flex items-center gap-4">
                {/* Left: input + uploading text */}
                <div className="flex flex-col gap-2">
                  <FileInput
                    id="coverImage"
                    accept="image/*"
                    error={!!fieldErrors.coverImage}
                    hint={fieldErrors.coverImage}
                    disabled={uploading.cover}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        setUploading((u) => ({ ...u, cover: true }));
                        clearFieldError("coverImage");
                        setError(null);
                        const media = await uploadMedia(
                          file,
                          "products/covers"
                        );
                        setCoverImage(media);
                      } catch (err: any) {
                        setFieldError(
                          "coverImage",
                          err.message ?? "Upload failed"
                        );
                      } finally {
                        setUploading((u) => ({ ...u, cover: false }));
                      }
                    }}
                  />
                  {uploading.cover && (
                    <p className="text-sm text-gray-500 mt-1">
                      Uploading image...
                    </p>
                  )}
                </div>

                {/* Right: image preview */}
                {coverImage && (
                  <div className="flex-shrink-0">
                    <Image
                      src={coverImage.url}
                      alt="Product Cover Image Preview"
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  </div>
                )}
              </div>
            </FormField>

            <FormField label="Description" htmlFor="description">
              <TextArea
                placeholder="A brief description about this product."
                rows={3}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <FormField label="Attributes">
              <AttributeEditor value={attributes} onChange={setAttributes} />
            </FormField>

            <FormField label="Featured">
              <Switch
                label="Mark as featured product"
                defaultChecked={isFeatured}
                onChange={setIsFeatured}
              />
            </FormField>

            <FormField label="Product Images" htmlFor="images">
              <Dropzone
                title="Drop product images here or Browse"
                description="PNG, JPG, WebP, etc supported"
                multiple
                accept={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/webp": [],
                }}
                onFiles={async (files) => {
                  try {
                    setUploading((u) => ({ ...u, images: true }));
                    const uploaded = await Promise.all(
                      files.map((file) => uploadMedia(file, "products/images"))
                    );
                    setImages((prev) => [...prev, ...uploaded]);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setUploading((u) => ({ ...u, images: false }));
                  }
                }}
              />
              {uploading.images && (
                <p className="text-sm text-gray-500">Uploading images...</p>
              )}
            </FormField>

            <FormField label="Product Videos" htmlFor="videos">
              <Dropzone
                title="Drop product videos here or Browse"
                description="MP4, WebM, MKV, etc supported"
                multiple
                accept={{ "video/*": [] }}
                onFiles={async (files) => {
                  try {
                    setUploading((u) => ({ ...u, videos: true }));
                    const uploaded = await Promise.all(
                      files.map((file) => uploadMedia(file, "products/videos"))
                    );
                    setVideos((prev) => [...prev, ...uploaded]);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setUploading((u) => ({ ...u, videos: false }));
                  }
                }}
              />
              {uploading.videos && (
                <p className="text-sm text-gray-500">Uploading videos...</p>
              )}
            </FormField>

            <FormField label="SubCategory Status">
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
                  ? "Create Product"
                  : "Update Product"
              }
              primaryDisabled={
                saving ||
                uploading.cover ||
                uploading.images ||
                uploading.videos ||
                hasErrors
              }
              backLabel="Cancel"
              onBack={() => router.push("/products")}
            />
          </form>
        )}
      </div>
    </div>
  );
}
