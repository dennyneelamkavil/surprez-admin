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
  CollapsibleFormSection,
} from "@/components/form";

import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { uploadMedia } from "@/lib/uploadMedia";
import { formatSlug } from "@/lib/utils";
import type { Media, Seo, SubCategoryBase } from "@/lib/types";
import type { AttributeRow } from "@/components/form";

type Fields =
  | "name"
  | "slug"
  | "coverImage"
  | "subcategories"
  | "brand"
  | "countryOfOrigin"
  | "keyFeatures";

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

  const [brand, setBrand] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");

  const [keyFeatures, setKeyFeatures] = useState<AttributeRow[]>([]);
  const [ingredientsOrMaterial, setIngredientsOrMaterial] = useState("");

  const [usageInstructions, setUsageInstructions] = useState("");
  const [safetyWarnings, setSafetyWarnings] = useState("");

  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [warrantyDetails, setWarrantyDetails] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

  const [gstin, setGstin] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerAddress, setManufacturerAddress] = useState("");
  const [certifications, setCertifications] = useState<AttributeRow[]>([]);

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

      setBrand(data.brand ?? "");
      setModelNumber(data.modelNumber ?? "");
      setCountryOfOrigin(data.countryOfOrigin ?? "");

      setIngredientsOrMaterial(data.ingredientsOrMaterial ?? "");

      setUsageInstructions(data.usageInstructions ?? "");
      setSafetyWarnings(data.safetyWarnings ?? "");

      setWarrantyPeriod(data.warranty?.period ?? "");
      setWarrantyDetails(data.warranty?.details ?? "");
      setReturnPolicy(data.returnPolicy ?? "");

      if (data.keyFeatures) {
        setKeyFeatures(
          Object.entries(data.keyFeatures).map(([key, val]) => ({
            id: crypto.randomUUID(),
            key,
            value: Array.isArray(val) ? val.join(", ") : String(val),
          })),
        );
      }

      if (data.attributes) {
        setAttributes(
          Object.entries(data.attributes).map(([key, val]) => ({
            id: crypto.randomUUID(),
            key,
            value: Array.isArray(val) ? val.join(", ") : String(val),
          })),
        );
      }

      setGstin(data.compliance?.gstin ?? "");
      setHsnCode(data.compliance?.hsnCode ?? "");
      setManufacturerName(data.compliance?.manufacturerDetails?.name ?? "");
      setManufacturerAddress(
        data.compliance?.manufacturerDetails?.address ?? "",
      );

      if (data.compliance?.certifications) {
        setCertifications(
          data.compliance.certifications.map((c: any) => ({
            id: crypto.randomUUID(),
            key: c.type,
            value: c.licenseNumber,
          })),
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

    if (!brand) {
      setFieldError("brand", "Brand is required");
      hasError = true;
    }

    if (!countryOfOrigin) {
      setFieldError("countryOfOrigin", "Country of origin is required");
      hasError = true;
    }

    if (!keyFeatures.length) {
      setFieldError("keyFeatures", "At least one key feature is required");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    const keyFeaturesPayload = keyFeatures
      .map((f) => f.value?.trim())
      .filter(Boolean);

    const attributesPayload = attributes.reduce<Record<string, any>>(
      (acc, { key, value }) => {
        if (!key) return acc;
        acc[key] = value.includes(",")
          ? value.split(",").map((v) => v.trim())
          : value;
        return acc;
      },
      {},
    );

    const certificationsPayload = certifications
      .filter((c) => c.key && c.value)
      .map((c) => ({
        type: c.key.trim(),
        licenseNumber: c.value.trim(),
      }));

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
            brand,
            modelNumber,
            countryOfOrigin,
            keyFeatures: keyFeaturesPayload,
            ingredientsOrMaterial,
            usageInstructions,
            safetyWarnings,
            warranty: {
              period: warrantyPeriod,
              details: warrantyDetails,
            },
            returnPolicy,
            compliance: {
              gstin,
              hsnCode,
              manufacturerDetails: {
                name: manufacturerName,
                address: manufacturerAddress,
              },
              certifications: certificationsPayload,
            },
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/products" : `/products/${id}`);
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

              <FormField label="Brand" required>
                <Input
                  placeholder="Nike, Samsung, Generic"
                  value={brand}
                  onChange={(e) => {
                    clearFieldError("brand");
                    setError(null);
                    setBrand(e.target.value);
                  }}
                  error={!!fieldErrors.brand}
                  hint={fieldErrors.brand}
                />
              </FormField>

              <FormField label="Model Number">
                <Input
                  placeholder="Product model number"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                />
              </FormField>

              <FormField label="Country of Origin" required>
                <Input
                  placeholder="India"
                  value={countryOfOrigin}
                  onChange={(e) => {
                    clearFieldError("countryOfOrigin");
                    setError(null);
                    setCountryOfOrigin(e.target.value);
                  }}
                  error={!!fieldErrors.countryOfOrigin}
                  hint={fieldErrors.countryOfOrigin}
                />
              </FormField>

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
                          "temp/products/covers",
                        );
                        setCoverImage(media);
                      } catch (err: any) {
                        setFieldError(
                          "coverImage",
                          err.message ?? "Upload failed",
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
                          prev ? { ...prev, alt: e.target.value } : prev,
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
                          prev ? { ...prev, caption: e.target.value } : prev,
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

            <FormField label="Key Features" required>
              <AttributeEditor
                value={keyFeatures}
                onChange={setKeyFeatures}
                config={{
                  keyPlaceholder: "Feature",
                  valuePlaceholder: "e.g. Lightweight design",
                  addButtonLabel: "+ Add Feature",
                }}
              />
            </FormField>

            <FormField label="Variants">
              <AttributeEditor
                value={attributes}
                onChange={setAttributes}
                config={{
                  keyPlaceholder: "Variant (e.g. material, brand)",
                  valuePlaceholder: "Value (comma separated)",
                  addButtonLabel: "+ Add Product Variant",
                  helperText:
                    "Used for product-level attributes like brand, material, or warranty.",
                }}
              />
            </FormField>

            <FormField label="Ingredients / Material">
              <TextArea
                placeholder="Cotton, Plastic, Active ingredients, etc."
                rows={2}
                value={ingredientsOrMaterial}
                onChange={setIngredientsOrMaterial}
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

            <CollapsibleFormSection
              title="Usage, Warranty & Returns"
              description="Instructions for use, safety information, warranty coverage, and return or replacement policies."
              collapsible
            >
              <FormField label="Usage Instructions">
                <TextArea
                  rows={2}
                  placeholder="How to use this product"
                  value={usageInstructions}
                  onChange={setUsageInstructions}
                />
              </FormField>

              <FormField label="Safety Warnings">
                <TextArea
                  rows={2}
                  placeholder="Warnings or precautions"
                  value={safetyWarnings}
                  onChange={setSafetyWarnings}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Warranty Period">
                  <Input
                    placeholder="1 Year, 6 Months"
                    value={warrantyPeriod}
                    onChange={(e) => setWarrantyPeriod(e.target.value)}
                  />
                </FormField>

                <FormField label="Warranty Details">
                  <TextArea
                    rows={2}
                    placeholder="Warranty terms and coverage"
                    value={warrantyDetails}
                    onChange={setWarrantyDetails}
                  />
                </FormField>
              </div>

              <FormField label="Return Policy">
                <TextArea
                  rows={2}
                  placeholder="7-day replacement only"
                  value={returnPolicy}
                  onChange={setReturnPolicy}
                />
              </FormField>
            </CollapsibleFormSection>

            <CollapsibleFormSection
              title="Tax & Compliance"
              description="Legal, tax, and regulatory information for this product"
              collapsible
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="GSTIN">
                    <Input
                      placeholder="GST Identification Number"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                    />
                  </FormField>

                  <FormField label="HSN Code">
                    <Input
                      placeholder="HSN Code"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Manufacturer / Packer Name">
                    <Input
                      placeholder="Company or Manufacturer Name"
                      value={manufacturerName}
                      onChange={(e) => setManufacturerName(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Manufacturer / Packer Address">
                    <TextArea
                      rows={2}
                      placeholder="Full address"
                      value={manufacturerAddress}
                      onChange={setManufacturerAddress}
                    />
                  </FormField>
                </div>

                <FormField label="Certifications / Licenses">
                  <AttributeEditor
                    value={certifications}
                    onChange={setCertifications}
                    config={{
                      keyPlaceholder: "Type (e.g. FSSAI, BIS)",
                      valuePlaceholder: "License Number",
                      addButtonLabel: "+ Add Certification",
                    }}
                  />
                </FormField>
              </div>
            </CollapsibleFormSection>

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
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
