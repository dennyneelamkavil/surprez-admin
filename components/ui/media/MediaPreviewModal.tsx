"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

type MediaPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video";
  src: string;
};

export default function MediaPreviewModal({
  isOpen,
  onClose,
  type,
  src,
}: MediaPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl min-w-xl max-h-[80vh] min-h-[60vh] p-4 bg-white/50 dark:bg-gray-900/50"
    >
      <div className="flex h-full w-full items-center justify-center">
        {type === "image" ? (
          <Image
            src={src}
            alt="Preview"
            width={600}
            height={600}
            className="max-h-[75vh] max-w-3xl rounded object-contain"
          />
        ) : (
          <video
            src={src}
            controls
            className="max-h-[75vh] max-w-3xl rounded"
          />
        )}
      </div>
    </Modal>
  );
}
