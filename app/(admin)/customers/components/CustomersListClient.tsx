"use client";

import { useState } from "react";
import Image from "next/image";

import AlertModal from "@/components/ui/alert/AlertModal";
import {
  ListActions,
  ListError,
  ListFilters,
  ListHeader,
} from "@/components/listing";
import { Select } from "@/components/form";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminTable } from "@/hooks";

import type { Category } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type CategorySortKey = "name" | "createdAt" | "isActive";

export default function CategoriesListClient() {
  const [item, setItem] = useState<Category | null>(null);
  const [toggleItem, setToggleItem] = useState<Category | null>(null);
  const [isActive, setIsActive] = useState("true");

  const {
    data: categories,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Category, CategorySortKey>({
    endpoint: "categories",
    storageKey: "table:categories",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      isActive,
    }),
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/categories/${item.id}`, {
      successMessage: "Category deleted successfully",
      errorMessage: "Failed to delete category",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/categories/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Category status updated",
        errorMessage: "Failed to update category status",
      }
    );

    if (success) refetch();
    setToggleItem(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="Categories"
        actionLabel="Create Category"
        actionHref="/categories/create"
        createPermission="category:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={() => {
          setSearch("");
          setIsActive("");
          setPage(1);
        }}
        disableClear={!search && !isActive}
      >
        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All" },
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            value={isActive}
            placeholder="Select status"
            onChange={(value) => {
              setPage(1);
              setIsActive(value);
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
                  <SortableTableHeader<CategorySortKey>
                    columnKey="name"
                    label="Name"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Image
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CategorySortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CategorySortKey>
                    columnKey="createdAt"
                    label="Created"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton columns={5} />
              ) : error ? (
                <ListError error={error} columns={5} />
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {category.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {category.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/categories/${category.id}`}
                        onToggle={() => setToggleItem(category)}
                        editHref={`/categories/${category.id}/edit`}
                        isActive={category.isActive}
                        onDelete={() => setItem(category)}
                        editPermission="category:update"
                        deletePermission="category:delete"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
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
        title={`Delete Category: ${item?.name}?`}
        message="If you just want to hide this category from users, consider marking it as inactive instead."
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
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} Category: ${
          toggleItem?.name
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this category.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
