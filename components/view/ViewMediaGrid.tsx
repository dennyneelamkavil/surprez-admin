"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPreviewModal from "@/components/ui/media/MediaPreviewModal";

type MediaItem = {
  publicId: string;
  url: string;
};

type ViewMediaGridProps = {
  label: string;
  items: MediaItem[];
  type: "image" | "video";
};

export default function ViewMediaGrid({
  label,
  items,
  type,
}: ViewMediaGridProps) {
  const [preview, setPreview] = useState<string | null>(null);

  if (!items.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-md text-gray-500">{label}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) =>
          type === "image" ? (
            <button
              key={item.publicId}
              onClick={() => setPreview(item.url)}
              className="focus:outline-none"
            >
              <Image
                src={item.url}
                alt={label}
                width={120}
                height={120}
                className="h-24 w-24 rounded object-cover hover:opacity-80 transition"
              />
            </button>
          ) : (
            <div key={item.publicId} className="space-y-2">
              <video src={item.url} controls className="w-full rounded" />
              <button
                onClick={() => setPreview(item.url)}
                className="rounded border p-2 text-md text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                ▶ Preview Video
              </button>
            </div>
          )
        )}
      </div>

      <MediaPreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        type={type}
        src={preview ?? ""}
      />
    </div>
  );
}
