"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Authorized } from "@/components/auth/Authorized";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  TextArea,
  FileInput,
  MultiSelect,
  Switch,
  AttributeEditor,
  ProductMediaManager,
  FormSEOSection,
} from "@/components/form";

import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { uploadMedia } from "@/lib/uploadMedia";
import { formatSlug } from "@/lib/utils";
import type { Media, Seo, SubCategoryBase } from "@/lib/types";
import type { AttributeRow } from "@/components/form";

type Fields = "name" | "slug" | "coverImage" | "subcategories";
type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function ProductFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [seo, setSeo] = useState<Seo>({});
  const [uploadingSeoImg, setUploadingSeoImg] = useState(false);

  const [coverImage, setCoverImage] = useState<Media | null>(null);
  const [images, setImages] = useState<Media[]>([]);
  const [videos, setVideos] = useState<Media[]>([]);

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);

  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [subcats, setSubcats] = useState<SubCategoryBase[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const [uploading, setUploading] = useState({
    cover: false,
    images: false,
    videos: false,
  });

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  async function fetchSubCategories() {
    const res = await fetch("/api/admin/subcategories?all=true", {
      cache: "no-store",
    });
    const json = await res.json();
    setSubcats(json.data);
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
      setSubcategories(data.subcategories.map((s: any) => s.id));
      setDescription(data.description ?? "");
      setIsFeatured(data.isFeatured);
      setSeo(data.seo ?? {});
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
  }, [id]);

  useEffect(() => {
    fetchSubCategories();
    if (mode === "edit") fetchProduct();
  }, [mode, fetchProduct]);

  const subCategoryOptions = subcats.map((sub) => ({
    value: sub.id,
    label: sub.name,
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
          headers: { "Content-Type": "application/json" },
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
            seo,
            isActive,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/products" : `/products/${id}/view`);
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
        title={mode === "create" ? "Create Product" : "Edit Product"}
        backHref="/products"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Cover Image" required htmlFor="coverImage">
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
                          "temp/products/covers"
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
                    <p className="text-sm text-gray-500">Uploading image...</p>
                  )}
                </FormField>

                {coverImage && (
                  <Image
                    src={coverImage.url}
                    alt="Cover preview"
                    width={120}
                    height={120}
                    className="rounded object-cover border dark:border-gray-800"
                  />
                )}
              </div>

              {coverImage && (
                <div className="space-y-4">
                  <FormField label="Image Alt Text">
                    <Input
                      placeholder="e.g. Dolls, Action Figures, etc."
                      value={coverImage.alt ?? ""}
                      onChange={(e) =>
                        setCoverImage((prev) =>
                          prev ? { ...prev, alt: e.target.value } : prev
                        )
                      }
                      hint="Describe the image for SEO & accessibility"
                    />
                  </FormField>

                  <FormField label="Image Caption (optional)">
                    <Input
                      placeholder="Optional caption shown below the image"
                      value={coverImage.caption ?? ""}
                      onChange={(e) =>
                        setCoverImage((prev) =>
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
                placeholder="A brief description about this product."
                rows={3}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <FormField label="Attributes">
              <AttributeEditor
                value={attributes}
                onChange={setAttributes}
                config={{
                  keyPlaceholder: "Attribute (e.g. material, brand)",
                  valuePlaceholder: "Value (comma separated)",
                  addButtonLabel: "+ Add Product Attribute",
                  helperText:
                    "Used for product-level attributes like brand, material, or warranty.",
                }}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Featured">
                <Switch
                  label="Mark as featured product"
                  defaultChecked={isFeatured}
                  onChange={setIsFeatured}
                />
              </FormField>

              <FormField label="Status">
                <Switch
                  label={isActive ? "Active" : "Inactive"}
                  defaultChecked={isActive}
                  onChange={setIsActive}
                />
              </FormField>
            </div>

            <ProductMediaManager
              label="Product Images"
              media={images}
              type="image"
              uploadFolder="temp/products/images"
              onChange={setImages}
              uploading={uploading.images}
              setUploading={setUploading}
            />

            <ProductMediaManager
              label="Product Videos"
              media={videos}
              type="video"
              uploadFolder="temp/products/videos"
              onChange={setVideos}
              uploading={uploading.videos}
              setUploading={setUploading}
            />

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
              onBack={() =>
                router.push(
                  mode === "create" ? "/products" : `/products/${id}/view`
                )
              }
            />
          </form>
        )}
      </div>
    </div>
  );
}
