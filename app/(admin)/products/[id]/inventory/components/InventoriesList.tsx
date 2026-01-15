"use client";

import { useState } from "react";

import AlertModal from "@/components/ui/alert/AlertModal";
import { ListActions, ListError, ListHeader } from "@/components/listing";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminTable } from "@/hooks";
import { deleteAction, toggleAction } from "@/lib/actions";

import type { ProductInventory } from "@/lib/types";

type InventorySortKey = "sku" | "stock" | "createdAt";

type Props = {
  productId: string;
};

export default function InventoriesList({ productId }: Props) {
  const [item, setItem] = useState<ProductInventory | null>(null);
  const [toggleItem, setToggleItem] = useState<ProductInventory | null>(null);

  const {
    data: inventories,
    loading,
    error,
    pagination,
    setPage,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<ProductInventory, InventorySortKey>({
    endpoint: "inventory",
    storageKey: `table:inventory:${productId}`,
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      productId,
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

  return (
    <div className="space-y-6">
      <ListHeader
        title="Inventories"
        actionLabel="Add Inventory"
        actionHref={`/inventory/create?productId=${productId}`}
        createPermission="inventory:create"
      />

      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="sku"
                    label="SKU"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="stock"
                    label="Stock"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium">
                  <SortableTableHeader<InventorySortKey>
                    columnKey="createdAt"
                    label="Created"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-right text-sm font-medium">
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
                  <td colSpan={6} className="px-5 py-6 text-center">
                    No inventory found
                  </td>
                </tr>
              ) : (
                inventories.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm">{inv.sku}</td>
                    <td className="px-5 py-4 text-sm">
                      ₹{inv.price.sellingPrice} /{" "}
                      <span className="line-through text-gray-400">
                        ₹{inv.price.mrp}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">{inv.stock}</td>
                    <td className="px-5 py-4 text-sm">
                      {inv.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/inventory/${inv.id}/view`}
                        editHref={`/inventory/${inv.id}/edit`}
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
        message="This will permanently remove this inventory."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
      />

      <AlertModal
        isOpen={!!toggleItem}
        variant="warning"
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} SKU: ${
          toggleItem?.sku
        }?`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
