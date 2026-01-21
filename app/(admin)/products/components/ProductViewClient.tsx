"use client";

import { useRouter } from "next/navigation";

import { Authorized } from "@/components/auth/Authorized";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewActions,
  ViewBadge,
  ViewField,
  ViewImage,
  ViewList,
  ViewMediaGrid,
  ViewRating,
  ViewSection,
  ViewSEOSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Product } from "@/lib/types";

type Props = {
  id: string;
};

export default function ProductViewClient({ id }: Props) {
  const router = useRouter();
  const {
    data: product,
    loading,
    error,
  } = useAdminEntity<Product>({
    endpoint: "products",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Product" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !product ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <ViewField label="Product" value={product.name} mono />
                <ViewField label="Slug" value={product.slug} mono />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Featured</p>
                  <ViewBadge
                    label={product.isFeatured ? "Yes" : "No"}
                    variant={product.isFeatured ? "success" : "info"}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={product.isActive ? "Active" : "Inactive"}
                    variant={product.isActive ? "success" : "danger"}
                  />
                </div>

                <ViewRating
                  average={product.rating.average}
                  count={product.rating.count}
                />
              </div>
            </div>

            <ViewList
              label="Subcategories"
              items={product.subcategories.map((s) => s.name)}
            />

            <ViewSection>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT */}
                <div className="space-y-6">
                  <ViewImage
                    label="Cover Image"
                    src={product.coverImage.url}
                    alt={product.coverImage.alt ?? product.name}
                    caption={product.coverImage.caption}
                    size={160}
                  />
                </div>
                {/* RIGHT */}
                <div className="lg:col-span-2 space-y-6">
                  {product.images.length > 0 && (
                    <ViewMediaGrid
                      label="Images"
                      items={product.images}
                      type="image"
                    />
                  )}

                  {product.videos.length > 0 && (
                    <ViewMediaGrid
                      label="Videos"
                      items={product.videos}
                      type="video"
                    />
                  )}
                </div>
              </div>
            </ViewSection>

            {product.description && (
              <div className="mt-6">
                <ViewField label="Description" value={product.description} />
              </div>
            )}

            {product.attributes && (
              <ViewSection title="Variants">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div
                      key={key}
                      className="rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
                    >
                      <p className="text-xs text-gray-500 dark:text-white/60 uppercase tracking-wide">
                        {key}
                      </p>
                      <p className="font-mono text-gray-900 dark:text-white">
                        {Array.isArray(val) ? val.join(", ") : val}
                      </p>
                    </div>
                  ))}
                </div>
              </ViewSection>
            )}

            <Authorized permission="seo:read">
              <ViewSEOSection
                seo={product.seo}
                collapsible
                defaultOpen={false}
              />
            </Authorized>

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(product.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(product.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Product"
              primaryPermission="product:update"
              onPrimary={() => router.push(`/products/${id}/edit`)}
              secondaryLabel="View Inventory"
              secondaryPermission="inventory:read"
              onSecondary={() => router.push(`/products/${id}/inventory`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
