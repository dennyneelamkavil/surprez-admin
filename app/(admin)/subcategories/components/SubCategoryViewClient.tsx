"use client";

import { useRouter } from "next/navigation";

import { Authorized } from "@/components/auth/Authorized";

import FormHeader from "@/components/form/FormHeader";
import FormError from "@/components/form/FormError";
import FormActions from "@/components/form/FormActions";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewBadge,
  ViewField,
  ViewImage,
  ViewSection,
  ViewSEOSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { SubCategory } from "@/lib/types";

type Props = {
  id: string;
};

export default function SubCategoryViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: subcategory,
    loading,
    error,
  } = useAdminEntity<SubCategory>({
    endpoint: "subcategories",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View SubCategory" backHref="/subcategories" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !subcategory ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ViewField label="SubCategory" value={subcategory.name} mono />
                <ViewField label="Slug" value={subcategory.slug} mono />
                <ViewField
                  label="Parent Category"
                  value={subcategory.category?.name}
                  mono
                />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={subcategory.isActive ? "Active" : "Inactive"}
                    variant={subcategory.isActive ? "success" : "danger"}
                  />
                </div>
              </div>
            </div>

            <ViewSection>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <ViewImage
                    label="SubCategory Image"
                    src={subcategory.image.url}
                    alt={subcategory.name}
                    size={160}
                  />
                </div>
              </div>
            </ViewSection>

            {subcategory.description && (
              <div className="mt-6">
                <ViewField
                  label="Description"
                  value={subcategory.description}
                />
              </div>
            )}

            <Authorized permission="seo:read">
              <ViewSEOSection
                seo={subcategory.seo}
                collapsible
                defaultOpen={false}
              />
            </Authorized>

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(subcategory.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(subcategory.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <FormActions
              primaryLabel="Edit SubCategory"
              onPrimary={() => router.push(`/subcategories/${id}/edit`)}
              onBack={() => router.push("/subcategories")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
