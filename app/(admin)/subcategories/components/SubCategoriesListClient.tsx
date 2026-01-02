"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/pagination/Pagination";
import Image from "next/image";
import Select from "@/components/form/Select";
import ListHeader from "@/components/common/ListHeader";
import ListFilters from "@/components/common/ListFilters";

type Category = {
  id: string;
  name: string;
};

type SubCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
};

type PaginationMeta = {
  page: number;
  totalPages: number;
};

export default function SubCategoriesListClient() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalPages: 1,
  });

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setCategories(data.categories ?? data);
  }

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/subcategories?page=${page}&limit=10&search=${search}&categoryId=${category}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // supports both paginated & non-paginated responses
      setSubCategories(data.subcategories ?? data);
      if (data.pagination) {
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this subcategory?");
    if (!ok) return;

    await fetch(`/api/admin/subcategories/${id}`, {
      method: "DELETE",
    });

    fetchSubCategories();
  }

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, [fetchSubCategories]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="SubCategories"
        actionLabel="Create SubCategory"
        actionHref="/subcategories/create"
      />

      <ListFilters
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        onClear={clearFilters}
        disableClear={!search && !category}
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
                  Category
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Image
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
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    Loading...
                  </td>
                </tr>
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
                        // src={subCat.image}
                        src={"/logo.png"}
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
                    <td className="px-5 py-4 text-right space-x-3">
                      <Link
                        href={`/subcategories/${subCat.id}/edit`}
                        className="text-sm font-medium text-brand-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(subCat.id)}
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
