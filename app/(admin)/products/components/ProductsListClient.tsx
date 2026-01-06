"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { ListActions, ListFilters, ListHeader } from "@/components/listing";
import Select from "@/components/form/Select";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

import type { Product, SubCategoryBase, PaginationMeta } from "@/lib/types";

export default function ProductsListClient() {
  const [subcats, setSubcats] = useState<SubCategoryBase[]>([]);
  const [subcategory, setSubcategory] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalPages: 1,
  });

  async function fetchSubCategories() {
    const res = await fetch("/api/admin/subcategories?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setSubcats(data.subcategories ?? data);
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/products?page=${page}&limit=10&search=${search}&subcategoryId=${subcategory}&isFeatured=${isFeatured}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // supports both paginated & non-paginated responses
      setProducts(data.products ?? data);
      if (data.pagination) {
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, subcategory, isFeatured]);

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
  }, [fetchProducts]);

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
                  Name
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subcategories
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cover Image
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Featured
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
                <TableSkeleton columns={7} />
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
                        editHref={`/products/${product.id}/edit`}
                        onDelete={() => handleDelete(product.id)}
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
