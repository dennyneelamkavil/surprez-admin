"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Authorized } from "@/components/auth/Authorized";
import Tooltip from "@/components/ui/tooltip/Tooltip";

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
          <Tooltip content="Edit">
            <Link
              href={editHref}
              aria-label="Edit"
              className="inline-flex items-center text-brand-500 hover:text-brand-600"
            >
              <Pencil size={16} />
            </Link>
          </Tooltip>
        </Authorized>
      )}

      {onDelete && deletePermission && (
        <Authorized permission={deletePermission}>
          <Tooltip content="Delete">
            <button
              type="button"
              onClick={onDelete}
              disabled={disableDelete}
              aria-label="Delete"
              className="inline-flex items-center text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </Authorized>
      )}
    </div>
  );
}
