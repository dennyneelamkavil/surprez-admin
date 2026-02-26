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
  ViewSection,
  ViewSEOSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Category } from "@/lib/types";

type Props = {
  id: string;
};

export default function CategoryViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: category,
    loading,
    error,
  } = useAdminEntity<Category>({
    endpoint: "categories",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Category" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !category ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ViewField label="Category" value={category.name} mono />
                <ViewField label="Slug" value={category.slug} mono />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={category.isActive ? "Active" : "Inactive"}
                    variant={category.isActive ? "success" : "danger"}
                  />
                </div>
              </div>
            </div>

            <ViewSection>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <ViewImage
                    label="Category Image"
                    src={category.image.url}
                    alt={category.image.alt ?? category.name}
                    caption={category.image.caption}
                    size={160}
                  />
                </div>
              </div>
            </ViewSection>

            {category.description && (
              <div className="mt-6">
                <ViewField label="Description" value={category.description} />
              </div>
            )}

            <Authorized permission="seo:read">
              <ViewSEOSection
                seo={category.seo}
                collapsible
                defaultOpen={false}
              />
            </Authorized>

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(category.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(category.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Category"
              primaryPermission="category:update"
              onPrimary={() => router.push(`/categories/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
