"use client";

import { useState } from "react";

import { ListHeader, ListFilters, ListError } from "@/components/listing";
import { Select, Input } from "@/components/form";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminTable } from "@/hooks";
import type { Order } from "@/lib/types";

type OrderSortKey =
  | "orderNumber"
  | "orderStatus"
  | "paymentStatus"
  | "createdAt";

export default function OrdersListClient() {
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    data: orders,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
  } = useAdminTable<Order, OrderSortKey>({
    endpoint: "orders",
    storageKey: "table:orders",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      orderStatus,
      paymentStatus,
      sellerId,
      customerId,
      fromDate,
      toDate,
    }),
  });

  function clearFilters() {
    setSearch("");
    setOrderStatus("");
    setPaymentStatus("");
    setSellerId("");
    setCustomerId("");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <ListHeader title="Orders" />
      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
      >
        <Select
          options={[
            { value: "", label: "All Order Status" },
            { value: "placed", label: "Placed" },
            { value: "confirmed", label: "Confirmed" },
            { value: "packed", label: "Packed" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          value={orderStatus}
          onChange={(v) => {
            setPage(1);
            setOrderStatus(v);
          }}
        />

        <Select
          options={[
            { value: "", label: "All Payment Status" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "failed", label: "Failed" },
            { value: "refunded", label: "Refunded" },
          ]}
          value={paymentStatus}
          onChange={(v) => {
            setPage(1);
            setPaymentStatus(v);
          }}
        />

        <Input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setPage(1);
            setFromDate(e.target.value);
          }}
        />

        <Input
          type="date"
          value={toDate}
          onChange={(e) => {
            setPage(1);
            setToDate(e.target.value);
          }}
        />
      </ListFilters>
      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<OrderSortKey>
                    columnKey="orderNumber"
                    label="Order"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Seller
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<OrderSortKey>
                    columnKey="orderStatus"
                    label="Order Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<OrderSortKey>
                    columnKey="paymentStatus"
                    label="Payment Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<OrderSortKey>
                    columnKey="createdAt"
                    label="Date"
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
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 dark:border-gray-800 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/orders/${order.id}`)
                    }
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {order.customer?.phone}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {order.seller?.businessName}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      ₹ {order.totals?.payableTotal}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90 capitalize">
                      {order.orderStatus}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90 capitalize">
                      {order.paymentStatus}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(order.createdAt).toLocaleDateString()}
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
    </div>
  );
}
