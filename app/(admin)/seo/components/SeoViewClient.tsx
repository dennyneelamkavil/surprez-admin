"use client";

import { useRouter } from "next/navigation";

import FormHeader from "@/components/form/FormHeader";
import FormError from "@/components/form/FormError";
import FormActions from "@/components/form/FormActions";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewBadge,
  ViewField,
  ViewSection,
  ViewSEOSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks/useAdminEntity";

import type { PageSeo } from "@/lib/types";

type Props = {
  id: string;
};

export default function SeoViewClient({ id }: Props) {
  const router = useRouter();

  const { data, loading, error } = useAdminEntity<PageSeo>({
    endpoint: "seo",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Page SEO" backHref="/seo" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !data ? null : (
          <div className="space-y-6">
            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ViewField
                  label="Page"
                  value={data.pageKey}
                  mono
                  valueClass="capitalize"
                />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={data.isActive ? "Active" : "Inactive"}
                    variant={data.isActive ? "success" : "danger"}
                  />
                </div>
              </div>
            </ViewSection>

            <ViewSEOSection seo={data.seo} />

            <FormActions
              primaryLabel="Edit Page SEO"
              onPrimary={() => router.push(`/seo/${id}/edit`)}
              onBack={() => router.push("/seo")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
