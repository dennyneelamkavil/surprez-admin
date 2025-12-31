"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Switch from "../../../../components/form/switch/Switch";
import Checkbox from "../../../../components/form/input/Checkbox";

type Permission = {
  id: string;
  key: string;
};

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function RoleFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPermissions() {
    const res = await fetch("/api/admin/permissions?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setPermissions(data.permissions ?? data);
  }

  const fetchRole = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/roles/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load role");

      const data = await res.json();
      setName(data.name);
      setIsSuperAdmin(data.isSuperAdmin);
      setSelected(data.permissions.map((p: any) => p.id));
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
        mode === "create" ? "/api/admin/roles" : `/api/admin/roles/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            isSuperAdmin,
            permissions: isSuperAdmin ? [] : selected,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push("/roles");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchPermissions();
    if (mode === "edit") fetchRole();
  }, [mode, fetchRole]);

  const ACTIONS = ["read", "create", "update", "delete"] as const;

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const [module, action] = perm.key.split(":");

    if (!ACTIONS.includes(action as any)) return acc;

    if (!acc[module]) acc[module] = {};
    acc[module][action] = perm;

    return acc;
  }, {} as Record<string, Record<string, Permission>>);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">
          {mode === "create" ? "Create Role" : "Edit Role"}
        </h1>

        <Link href="/roles" className="text-sm text-brand-500 hover:underline">
          Back to list
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="admin"
              />
            </div>

            <Checkbox
              checked={isSuperAdmin}
              onChange={setIsSuperAdmin}
              label="Super Admin (bypass permissions)"
            />

            {!isSuperAdmin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-5 py-3 text-left text-sm font-medium">
                          Module
                        </th>
                        {ACTIONS.map((action) => (
                          <th
                            key={action}
                            className="px-5 py-3 text-center text-sm font-medium capitalize"
                          >
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(groupedPermissions).map(
                        ([module, perms]) => (
                          <tr
                            key={module}
                            className="border-t border-gray-200 dark:border-gray-800"
                          >
                            <td className="px-5 py-4 font-medium capitalize">
                              {module}
                            </td>

                            {ACTIONS.map((action) => {
                              const permission = perms[action];
                              const isChecked =
                                permission && selected.includes(permission.id);

                              return (
                                <td
                                  key={action}
                                  className="px-5 py-4 text-center"
                                >
                                  {permission ? (
                                    <div className="flex justify-center">
                                      <Switch
                                        label=""
                                        defaultChecked={isChecked}
                                        onChange={(checked) =>
                                          setSelected((prev) =>
                                            checked
                                              ? [...prev, permission.id]
                                              : prev.filter(
                                                  (id) => id !== permission.id
                                                )
                                          )
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Role"
                  : "Update Role"}
              </button>

              <Link
                href="/roles"
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
