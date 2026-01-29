"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { ViewSection } from "@/components/view";

type Props = {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export default function CollapsibleViewSection({
  title,
  children,
  collapsible = false,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);

  return (
    <ViewSection>
      {/* Header */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400"
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
      {open && <div className="space-y-6">{children}</div>}
    </ViewSection>
  );
}
