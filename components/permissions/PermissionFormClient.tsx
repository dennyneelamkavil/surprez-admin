"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function PermissionFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermission = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/permissions/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load permission");

      const data = await res.json();
      setKey(data.key);
      setDescription(data.description ?? "");
    } catch {
      setError("Failed to load permission");
    } finally {
      setLoading(false);
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/permissions"
          : `/api/admin/permissions/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key, description }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push("/permissions");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (mode === "edit") fetchPermission();
  }, [mode, fetchPermission]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase() // force lowercase
      .replace(/\s+/g, "") // remove spaces
      .replace(/[^a-z:]/g, ""); // allow only a-z and :

    setKey(value);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {mode === "create" ? "Create Permission" : "Edit Permission"}
        </h1>

        <Link
          href="/permissions"
          className="text-sm text-brand-500 hover:underline"
        >
          Back to list
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10">
                {error}
              </div>
            )}

            {/* Key */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Permission Key
              </label>
              <input
                type="text"
                value={key}
                onChange={handleKeyChange}
                required
                disabled={mode === "edit"}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs disabled:opacity-70 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="user:create"
              />
              {mode === "create" && (
                <div className="mt-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <p className="font-medium">How permission keys work:</p>
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    <li>
                      <code className="font-mono">user</code> → generates{" "}
                      <code className="font-mono">
                        user:create, user:read, user:update, user:delete
                      </code>
                    </li>
                    <li>
                      <code className="font-mono">user:create</code> → creates a
                      single permission
                    </li>
                  </ul>
                </div>
              )}
              {mode === "edit" && (
                <p className="mt-1 text-xs text-gray-500">
                  Permission key cannot be changed
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="What this permission allows"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Permission"
                  : "Update Permission"}
              </button>

              <Link
                href="/permissions"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
