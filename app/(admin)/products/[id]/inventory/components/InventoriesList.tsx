"use client";

import { useState } from "react";

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

import type { ProductInventory } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type InventorySortKey =
  | "sku"
  | "stock"
  | "price.sellingPrice"
  | "isActive"
  | "createdAt";

type Props = {
  productId?: string;
};

export default function InventoriesList({ productId }: Props) {
  const [item, setItem] = useState<ProductInventory | null>(null);
  const [toggleItem, setToggleItem] = useState<ProductInventory | null>(null);
  const [isActive, setIsActive] = useState("true");

  const {
    data: inventories,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<ProductInventory, InventorySortKey>({
    endpoint: "inventory",
    storageKey: "table:inventory",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      productId,
      isActive,
    }),
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/inventory/${item.id}`, {
      successMessage: "Inventory deleted successfully",
      errorMessage: "Failed to delete inventory",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/inventory/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Inventory status updated",
        errorMessage: "Failed to update inventory",
      }
    );

    if (success) refetch();
    setToggleItem(null);
  }

  function clearFilters() {
    setSearch("");
    setIsActive("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Inventories"
        actionLabel="Add Inventory"
        actionHref={`/products/${productId}/inventory/create`}
        createPermission="inventory:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
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

      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="sku"
                    label="SKU"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="price.sellingPrice"
                    label="Price"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="stock"
                    label="Stock"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<InventorySortKey>
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
              ) : inventories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No inventory found
                  </td>
                </tr>
              ) : (
                inventories.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {inv.sku}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      ₹{inv.price.sellingPrice}
                      {inv.price.mrp !== inv.price.sellingPrice && (
                        <>
                          {" "}
                          /{" "}
                          <span className="line-through text-gray-400">
                            ₹{inv.price.mrp}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {inv.stock}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {inv.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/products/${productId}/inventory/${inv.id}`}
                        editHref={`/products/${productId}/inventory/${inv.id}/edit`}
                        isActive={inv.isActive}
                        onToggle={() => setToggleItem(inv)}
                        onDelete={() => setItem(inv)}
                        editPermission="inventory:update"
                        deletePermission="inventory:delete"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
        isOpen={!!item}
        variant="danger"
        title={`Delete SKU: ${item?.sku}?`}
        message="If you only want to hide this inventory, you can deactivate it instead."
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
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} SKU: ${
          toggleItem?.sku
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this inventory.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
