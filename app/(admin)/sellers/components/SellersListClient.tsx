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

import { deleteAction, toggleAction } from "@/lib/actions";
import type { Seller } from "@/lib/types";

type SellerSortKey =
  | "businessName"
  | "sellerType"
  | "email"
  | "status"
  | "isActive"
  | "createdAt";

export default function SellersListClient() {
  const [item, setItem] = useState<Seller | null>(null);
  const [toggleItem, setToggleItem] = useState<Seller | null>(null);

  const [sellerType, setSellerType] = useState("");
  const [status, setStatus] = useState("");
  const [isActive, setIsActive] = useState("true");

  const {
    data: sellers,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Seller, SellerSortKey>({
    endpoint: "sellers",
    storageKey: "table:sellers",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      sellerType,
      status,
      isActive,
    }),
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/sellers/${item.id}`, {
      successMessage: "Seller deleted successfully",
      errorMessage: "Failed to delete seller",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/sellers/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Seller status updated",
        errorMessage: "Failed to update seller status",
      },
    );

    if (success) refetch();
    setToggleItem(null);
  }

  function clearFilters() {
    setSearch("");
    setSellerType("");
    setStatus("");
    setIsActive("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Sellers"
        actionLabel="Create Seller"
        actionHref="/sellers/create"
        createPermission="seller:create"
      />
      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
        disableClear={!search && !sellerType && !status && !isActive}
      >
        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All Types" },
              { value: "vendor", label: "Vendor" },
              { value: "craft_maker", label: "Craft Maker" },
            ]}
            value={sellerType}
            placeholder="Seller type"
            onChange={(value) => {
              setPage(1);
              setSellerType(value);
            }}
          />
        </div>

        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "suspended", label: "Suspended" },
              { value: "rejected", label: "Rejected" },
            ]}
            value={status}
            placeholder="Seller status"
            onChange={(value) => {
              setPage(1);
              setStatus(value);
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
            placeholder="Active status"
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
                  <SortableTableHeader<SellerSortKey>
                    columnKey="businessName"
                    label="Business Name"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SellerSortKey>
                    columnKey="email"
                    label="Email"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SellerSortKey>
                    columnKey="sellerType"
                    label="Seller Type"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SellerSortKey>
                    columnKey="status"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SellerSortKey>
                    columnKey="isActive"
                    label="Active"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<SellerSortKey>
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
              ) : sellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No sellers found
                  </td>
                </tr>
              ) : (
                sellers.map((seller) => (
                  <tr
                    key={seller.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {seller.businessName}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {seller.email}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {seller.sellerType === "craft_maker"
                        ? "Craft Maker"
                        : "Vendor"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90 capitalize">
                      {seller.status}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {seller.isActive ? "Active" : "Inactive"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/sellers/${seller.id}`}
                        editHref={`/sellers/${seller.id}/edit`}
                        onToggle={() => setToggleItem(seller)}
                        isActive={seller.isActive}
                        onDelete={() => setItem(seller)}
                        editPermission="seller:update"
                        deletePermission="seller:delete"
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
        isOpen={!!item?.id}
        variant="danger"
        title={`Delete Seller: ${item?.businessName}?`}
        message="If you want to block the seller from accessing their account, please deactivate them instead of deleting."
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
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} Seller: ${
          toggleItem?.businessName
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this seller.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
