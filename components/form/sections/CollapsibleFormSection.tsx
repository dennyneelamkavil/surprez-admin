"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
};

export default function CollapsibleFormSection({
  title,
  children,
  collapsible = false,
  defaultOpen = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400"
        >
          <span>{title}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Content */}
      {open && <div className="space-y-8">{children}</div>}
    </div>
  );
}
