"use client";

import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { Authorized } from "../auth/Authorized";

type ListHeaderProps = {
  title: string;
  actionLabel: string;
  actionHref: string;
  createPermission?: string;
};

export default function ListHeader({
  title,
  actionLabel,
  actionHref,
  createPermission,
}: ListHeaderProps) {
  const ActionButton = (
    <Button variant="primary">
      <Link href={actionHref}>{actionLabel}</Link>
    </Button>
  );

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h1>

      {createPermission ? (
        <Authorized permission={createPermission}>{ActionButton}</Authorized>
      ) : (
        ActionButton
      )}
    </div>
  );
}
