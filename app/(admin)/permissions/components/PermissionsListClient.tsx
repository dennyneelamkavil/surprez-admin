"use client";

import { useCallback, useEffect, useState } from "react";

import AlertModal from "@/components/ui/alert/AlertModal";
import {
  ListActions,
  ListError,
  ListFilters,
  ListHeader,
} from "@/components/listing";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

import type { Permission, PaginationMeta } from "@/lib/types";
import { deleteAction } from "@/lib/actions";

export default function PermissionsListClient() {
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Permission | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalPages: 1,
  });

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/permissions?page=${page}&limit=10&search=${search}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // supports both paginated & non-paginated responses
      setPermissions(data.permissions ?? data);
      if (data.pagination) {
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        });
      }
    } catch (error: any) {
      setError(error.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/permissions/${item.id}`, {
      successMessage: "Permission deleted successfully",
      errorMessage: "Failed to delete permission",
    });

    if (success) {
      fetchPermissions();
    }
    setItem(null);
  }

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="Permissions"
        actionLabel="Create Permission"
        actionHref="/permissions/create"
        createPermission="permission:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={() => {
          setSearch("");
          setPage(1);
        }}
        disableClear={!search}
      />

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Key
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created
                </th>
                <th className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton columns={4} />
              ) : error ? (
                <ListError error={error} columns={4} />
              ) : permissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No permissions found
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr
                    key={permission.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {permission.key}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {permission.description || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(permission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        editHref={`/permissions/${permission.id}/edit`}
                        onDelete={() => setItem(permission)}
                        editPermission="permission:update"
                        deletePermission="permission:delete"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-end p-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <AlertModal
        isOpen={!!item?.id}
        variant="danger"
        title={`Delete Permission: ${item?.key}?`}
        message="This will permanently remove this permission if it is not in use."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
