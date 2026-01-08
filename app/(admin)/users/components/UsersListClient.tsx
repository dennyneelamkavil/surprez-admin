"use client";

import { useCallback, useEffect, useState } from "react";

import AlertModal from "@/components/ui/alert/AlertModal";
import {
  ListActions,
  ListError,
  ListFilters,
  ListHeader,
} from "@/components/listing";
import Select from "@/components/form/Select";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

import type { User, RoleBase, PaginationMeta } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

export default function UsersListClient() {
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<User | null>(null);
  const [toggleItem, setToggleItem] = useState<User | null>(null);
  const [roles, setRoles] = useState<RoleBase[]>([]);
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalPages: 1,
  });

  async function fetchRoles() {
    const res = await fetch("/api/admin/roles?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setRoles(data.roles ?? data);
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?page=${page}&limit=10&search=${search}&roleId=${role}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // supports both paginated & non-paginated responses
      setUsers(data.users ?? data);
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
  }, [page, search, role]);

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/users/${item.id}`, {
      successMessage: "User deleted successfully",
      errorMessage: "Failed to delete user",
    });

    if (success) {
      fetchUsers();
    }
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/users/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "User status updated",
        errorMessage: "Failed to update user status",
      }
    );

    if (success) {
      fetchUsers();
    }
    setToggleItem(null);
  }

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers]);

  function clearFilters() {
    setSearch("");
    setRole("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="Users"
        actionLabel="Create User"
        actionHref="/users/create"
        createPermission="user:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
        disableClear={!search && !role}
      >
        {/* Role filter */}
        <div className="w-full sm:max-w-xs">
          <Select
            options={roles.map((r) => ({
              value: r.id,
              label: r.name,
            }))}
            value={role}
            placeholder="Select a role"
            onChange={(value) => {
              setPage(1);
              setRole(value);
            }}
          />
        </div>
      </ListFilters>

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Username
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
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
                <TableSkeleton columns={6} />
              ) : error ? (
                <ListError error={error} columns={6} />
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {user.username}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {user.fullname}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {user.role?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        onToggle={() => setToggleItem(user)}
                        editHref={`/users/${user.id}/edit`}
                        isActive={user.isActive}
                        onDelete={() => setItem(user)}
                        editPermission="user:update"
                        deletePermission="user:delete"
                        disableToggle={user.username === "superadmin"}
                        disableDelete={user.username === "superadmin"}
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
        title={`Delete User: ${item?.fullname}?`}
        message="If you only want to block access, mark the user as inactive instead."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
        secondaryText="Deactivate Instead"
        onSecondary={() => {
          setToggleItem(item);
          setItem(null);
        }}
      />
      <AlertModal
        isOpen={!!toggleItem}
        variant="warning"
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} User: ${
          toggleItem?.fullname
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this user.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
