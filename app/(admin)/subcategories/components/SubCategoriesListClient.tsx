"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import {
  ListActions,
  ListError,
  ListFilters,
  ListHeader,
} from "@/components/listing";
import Select from "@/components/form/Select";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

import type { SubCategory, CategoryBase, PaginationMeta } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

export default function SubCategoriesListClient() {
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<CategoryBase[]>([]);
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
    } catch (error: any) {
      setError(error.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  async function handleDelete(id: string) {
    const success = await deleteAction(`/api/admin/subcategories/${id}`, {
      confirmMessage: "Are you sure you want to delete this subcategory?",
      successMessage: "Subcategory deleted successfully",
      errorMessage: "Failed to delete subcategory",
    });

    if (success) {
      fetchSubCategories();
    }
  }

  async function handleToggleStatus(subcategory: SubCategory) {
    const success = await toggleAction(
      `/api/admin/subcategories/${subcategory.id}`,
      { isActive: !subcategory.isActive },
      {
        confirmMessage: `Are you sure you want to ${
          subcategory.isActive ? "deactivate" : "activate"
        } this subcategory?`,
        successMessage: "Subcategory status updated",
        errorMessage: "Failed to update subcategory status",
      }
    );

    if (success) {
      fetchSubCategories();
    }
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
        createPermission="subcategory:create"
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
                        onToggle={() => handleToggleStatus(subCat)}
                        editHref={`/subcategories/${subCat.id}/edit`}
                        isActive={subCat.isActive}
                        onDelete={() => handleDelete(subCat.id)}
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
