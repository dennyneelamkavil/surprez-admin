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

import type { Role, PaginationMeta } from "@/lib/types";
import { deleteAction } from "@/lib/actions";

export default function RolesListClient() {
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalPages: 1,
  });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/roles?page=${page}&limit=10&search=${search}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      setRoles(data.roles ?? data);
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

    const success = await deleteAction(`/api/admin/roles/${item.id}`, {
      successMessage: "Role deleted successfully",
      errorMessage: "Failed to delete role",
    });

    if (success) {
      fetchRoles();
    }
    setItem(null);
  }

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <div className="space-y-6">
      <ListHeader
        title="Roles"
        actionLabel="Create Role"
        actionHref="/roles/create"
        createPermission="role:create"
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

      <div className="rounded-lg border bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full table-auto">
          <thead className="border-b dark:border-gray-800">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Super Admin
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
            ) : roles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                >
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-b dark:border-gray-800">
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                    {role.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                    {role.isSuperAdmin ? "Yes" : "No"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {role.name === "superadmin" ? (
                      <span className="text-sm italic text-gray-400">
                        System role
                      </span>
                    ) : (
                      <ListActions
                        editHref={`/roles/${role.id}/edit`}
                        onDelete={() => setItem(role)}
                        editPermission="role:update"
                        deletePermission="role:delete"
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
        title={`Delete Role: ${item?.name}?`}
        message="This will permanently remove this role if it is not in use."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
