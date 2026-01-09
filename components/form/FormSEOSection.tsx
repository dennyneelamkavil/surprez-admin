"use client";

import { useState } from "react";
import Image from "next/image";

import FormField from "@/components/form/FormField";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Switch from "@/components/form/switch/Switch";
import FileInput from "@/components/form/input/FileInput";

import type { Seo, Media } from "@/lib/types";
import { ChevronDown } from "lucide-react";

type Props = {
  value: Seo;
  onChange: (value: Seo) => void;
  uploading?: boolean;
  onUploadOgImage?: (file: File) => Promise<Media>;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export default function FormSEOSection({
  value,
  onChange,
  uploading,
  onUploadOgImage,
  collapsible = false,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);

  function update<K extends keyof Seo>(key: K, val: Seo[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="space-y-6">
      {/* Header (only when collapsible) */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium dark:border-gray-800 dark:bg-gray-800/40"
        >
          <span>Advanced SEO</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Content */}
      {open && (
        <div className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="SEO Title">
              <Input
                placeholder="SEO title (max 60–70 characters)"
                value={value.title ?? ""}
                onChange={(e) => update("title", e.target.value)}
              />
            </FormField>

            <FormField label="Canonical URL">
              <Input
                placeholder="https://example.com/page"
                value={value.canonical ?? ""}
                onChange={(e) => update("canonical", e.target.value)}
              />
            </FormField>
          </div>

          {/* Row 2 */}
          <FormField label="SEO Description">
            <TextArea
              rows={3}
              placeholder="Meta description (max 150–160 characters)"
              value={value.description ?? ""}
              onChange={(val) => update("description", val)}
            />
          </FormField>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="SEO Keywords">
              <Input
                placeholder="comma,separated,keywords"
                value={value.keywords?.join(", ") ?? ""}
                onChange={(e) =>
                  update(
                    "keywords",
                    e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                  )
                }
              />
            </FormField>

            <FormField label="Search Engine Indexing">
              <Switch
                label={value.noIndex ? "No Index" : "Indexable"}
                defaultChecked={!!value.noIndex}
                onChange={(checked) => update("noIndex", checked)}
              />
            </FormField>
          </div>

          {/* OG Image */}
          {onUploadOgImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="OG Image">
                <FileInput
                  accept="image/*"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const media = await onUploadOgImage(file);
                    update("ogImage", media);
                  }}
                />

                {uploading && (
                  <p className="mt-1 text-sm text-gray-500">Uploading image…</p>
                )}
              </FormField>

              {value.ogImage && (
                <div className="flex items-end">
                  <Image
                    src={value.ogImage.url}
                    alt="OG Image Preview"
                    width={160}
                    height={84}
                    className="rounded object-cover border dark:border-gray-800"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
