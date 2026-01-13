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
import Select from "@/components/form/Select";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminAll, useAdminTable } from "@/hooks";

import type { Product, SubCategoryBase } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type ProductSortKey = "name" | "isFeatured" | "isActive" | "createdAt";

export default function ProductsListClient() {
  const [item, setItem] = useState<Product | null>(null);
  const [toggleItem, setToggleItem] = useState<Product | null>(null);
  const [subcategory, setSubcategory] = useState("");
  const [isFeatured, setIsFeatured] = useState("");

  const {
    data: products,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Product, ProductSortKey>({
    endpoint: "products",
    storageKey: "table:products",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      subcategoryId: subcategory,
      isFeatured,
    }),
  });
  const { data: subcats } = useAdminAll<SubCategoryBase>({
    endpoint: "subcategories",
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/products/${item.id}`, {
      successMessage: "Product deleted successfully",
      errorMessage: "Failed to delete product",
    });

    if (success) {
      refetch();
    }
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/products/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Product status updated",
        errorMessage: "Failed to update product status",
      }
    );

    if (success) {
      refetch();
    }
    setToggleItem(null);
  }

  function clearFilters() {
    setSearch("");
    setSubcategory("");
    setIsFeatured("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="Products"
        actionLabel="Create Product"
        actionHref="/products/create"
        createPermission="product:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
        disableClear={!search && !subcategory && !isFeatured}
      >
        {/* Role filter */}
        <div className="w-full sm:max-w-xs">
          <Select
            options={subcats.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={subcategory}
            placeholder="Select a subcategory"
            onChange={(value) => {
              setPage(1);
              setSubcategory(value);
            }}
          />
        </div>

        {/* Featured filter */}
        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All" },
              { value: "true", label: "Featured" },
              { value: "false", label: "Not Featured" },
            ]}
            value={isFeatured}
            placeholder="Select featured status"
            onChange={(value) => {
              setPage(1);
              setIsFeatured(value);
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
                  <SortableTableHeader<ProductSortKey>
                    columnKey="name"
                    label="Name"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subcategories
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cover Image
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<ProductSortKey>
                    columnKey="isFeatured"
                    label="Featured"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<ProductSortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<ProductSortKey>
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
                <TableSkeleton columns={7} />
              ) : error ? (
                <ListError error={error} columns={7} />
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {product.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      <div className="flex flex-wrap gap-2">
                        {product.subcategories &&
                        product.subcategories.length > 0 ? (
                          product.subcategories.map((sub) => (
                            <span
                              key={sub.id}
                              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            >
                              {sub.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      <Image
                        src={product.coverImage.url}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {product.isFeatured ? "Yes" : "No"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {product.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/products/${product.id}/view`}
                        onToggle={() => setToggleItem(product)}
                        editHref={`/products/${product.id}/edit`}
                        isActive={product.isActive}
                        onDelete={() => setItem(product)}
                        editPermission="product:update"
                        deletePermission="product:delete"
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
        title={`Delete Product: ${item?.name}?`}
        message="If you only want to hide this product from users, consider marking it as inactive instead."
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
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} Product: ${
          toggleItem?.name
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this product.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
