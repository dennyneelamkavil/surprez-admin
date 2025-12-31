"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/pagination/Pagination";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  isActive: boolean;
  isFeatured: boolean;
  subcategories: [
    {
      id: string;
      name: string;
    }
  ];
  createdAt: string;
};

type PaginationMeta = {
  page: number;
  totalPages: number;
};

export default function ProductsListClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalPages: 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/products?page=${page}&limit=10&search=${search}`,
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
  }, [page, search]);

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
  }, [fetchProducts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Products
        </h1>

        <Link
          href="/products/create"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Create Product
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

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
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    Loading...
                  </td>
                </tr>
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
                        // src={product.coverImage}
                        src={"/logo.png"}
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
                    <td className="px-5 py-4 text-right space-x-3">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="text-sm font-medium text-brand-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
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
