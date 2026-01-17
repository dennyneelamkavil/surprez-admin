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

import { useAdminAll, useAdminTable } from "@/hooks";

import type { SubCategory, CategoryBase } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type SubCatSortKey = "name" | "isActive" | "createdAt";

export default function SubCategoriesListClient() {
  const [item, setItem] = useState<SubCategory | null>(null);
  const [toggleItem, setToggleItem] = useState<SubCategory | null>(null);
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState("true");

  const {
    data: subCategories,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<SubCategory, SubCatSortKey>({
    endpoint: "subcategories",
    storageKey: "table:subcategories",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      categoryId: category,
      isActive,
    }),
  });
  const { data: categories } = useAdminAll<CategoryBase>({
    endpoint: "categories",
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/subcategories/${item.id}`, {
      successMessage: "Subcategory deleted successfully",
      errorMessage: "Failed to delete subcategory",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/subcategories/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Subcategory status updated",
        errorMessage: "Failed to update subcategory status",
      }
    );

    if (success) refetch();
    setToggleItem(null);
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setIsActive("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="SubCategories"
        actionLabel="Create SubCategory"
        actionHref="/subcategories/create"
        createPermission="subcategory:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        onClear={clearFilters}
        disableClear={!search && !category && !isActive}
      >
        <div className="w-full sm:max-w-xs">
          <Select
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={category}
            placeholder="Select a category"
            onChange={(value) => {
              setPage(1);
              setCategory(value);
            }}
          />
        </div>

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
                  <SortableTableHeader<SubCatSortKey>
                    columnKey="name"
                    label="Name"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Image
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SubCatSortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SubCatSortKey>
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
                <TableSkeleton columns={6} />
              ) : error ? (
                <ListError error={error} columns={6} />
              ) : subCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No subcategories found
                  </td>
                </tr>
              ) : (
                subCategories.map((subCat) => (
                  <tr
                    key={subCat.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {subCat.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {subCat.category.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      <Image
                        src={subCat.image.url}
                        alt={subCat.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {subCat.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(subCat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/subcategories/${subCat.id}`}
                        onToggle={() => setToggleItem(subCat)}
                        editHref={`/subcategories/${subCat.id}/edit`}
                        isActive={subCat.isActive}
                        onDelete={() => setItem(subCat)}
                        editPermission="subcategory:update"
                        deletePermission="subcategory:delete"
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
        title={`Delete SubCategory: ${item?.name}?`}
        message="If you only want to hide this subcategory from users, consider marking it as inactive instead."
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
        title={`${
          toggleItem?.isActive ? "Deactivate" : "Activate"
        } SubCategory: ${toggleItem?.name}?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this subcategory.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
