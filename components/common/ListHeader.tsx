"use client";

import Link from "next/link";
import Button from "@/components/ui/button/Button";

type ListHeaderProps = {
  title: string;
  actionLabel: string;
  actionHref: string;
};

export default function ListHeader({
  title,
  actionLabel,
  actionHref,
}: ListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h1>

      <Button variant="primary">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
