"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Authorized } from "@/components/auth/Authorized";

type ListActionsProps = {
  editHref?: string;
  onDelete?: () => void;

  editPermission?: string;
  deletePermission?: string;

  disableDelete?: boolean;
};

export default function ListActions({
  editHref,
  onDelete,
  editPermission,
  deletePermission,
  disableDelete = false,
}: ListActionsProps) {
  return (
    <div className="inline-flex items-center gap-3">
      {editHref && editPermission && (
        <Authorized permission={editPermission}>
          <Link
            href={editHref}
            title="Edit"
            aria-label="Edit"
            className="inline-flex items-center text-brand-500 hover:text-brand-600"
          >
            <Pencil size={16} />
          </Link>
        </Authorized>
      )}

      {onDelete && deletePermission && (
        <Authorized permission={deletePermission}>
          <button
            type="button"
            onClick={onDelete}
            disabled={disableDelete}
            title="Delete"
            aria-label="Delete"
            className="inline-flex items-center text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
          </button>
        </Authorized>
      )}
    </div>
  );
}
