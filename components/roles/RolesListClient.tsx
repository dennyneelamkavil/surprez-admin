"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/pagination/Pagination";

type Role = {
  id: string;
  name: string;
  isSuperAdmin: boolean;
  createdAt: string;
};

type PaginationMeta = {
  page: number;
  totalPages: number;
};

export default function RolesListClient() {
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
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this role?");
    if (!ok) return;

    await fetch(`/api/admin/roles/${id}`, { method: "DELETE" });

    fetchRoles();
  }

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Roles</h1>
        <Link
          href="/roles/create"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Create Role
        </Link>
      </div>

      <div className="max-w-sm">
        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="rounded-lg border bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full table-auto">
          <thead className="border-b dark:border-gray-800">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-5 py-3 text-left text-sm font-medium">
                Super Admin
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Created
              </th>
              <th className="px-5 py-3 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-b dark:border-gray-800">
                  <td className="px-5 py-4 text-sm">{role.name}</td>
                  <td className="px-5 py-4 text-sm">
                    {role.isSuperAdmin ? "Yes" : "No"}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right space-x-3">
                    {role.name !== "superadmin" ? (
                      <>
                        <Link
                          href={`/roles/${role.id}/edit`}
                          className="text-brand-500 hover:underline text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">
                        System role (cannot edit or delete)
                      </span>
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
    </div>
  );
}
