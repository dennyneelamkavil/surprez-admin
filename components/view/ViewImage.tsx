import { useState } from "react";
import Image from "next/image";
import MediaPreviewModal from "@/components/ui/media/MediaPreviewModal";

type ViewImageProps = {
  label: string;
  src: string;
  alt: string;
  size?: number;
};

export default function ViewImage({
  label,
  src,
  alt,
  size = 120,
}: ViewImageProps) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <p className="text-md text-gray-500 mb-2">{label}</p>
      <button onClick={() => setPreview(src)} className="focus:outline-none">
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="rounded object-cover border dark:border-gray-800"
        />
      </button>

      <MediaPreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        type="image"
        src={preview ?? ""}
      />
    </div>
  );
}
