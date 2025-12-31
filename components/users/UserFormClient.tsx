"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeCloseIcon, EyeIcon } from "@/icons";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

type Role = {
  id: string;
  name: string;
};

export default function UserFormClient({ mode, id }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function fetchRoles() {
    const res = await fetch("/api/admin/roles?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    setRoles(data.roles ?? data);
  }

  const fetchUser = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load user");

      const data = await res.json();
      setUsername(data.username);
      setFullname(data.fullname);
      setEmail(data.email ?? "");
      setRole(data.role?.id ?? "");
    } catch {
      setError("Failed to load user");
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
        mode === "create" ? "/api/admin/users" : `/api/admin/users/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            fullname,
            email,
            password: password || undefined,
            role,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push("/users");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchRoles();
    if (mode === "edit") fetchUser();
  }, [mode, fetchUser]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase() // force lowercase
      .replace(/\s+/g, "") // remove spaces
      .replace(/[^a-z0-9_]/g, ""); // allow only a-z, 0-9 and _

    setUsername(value);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {mode === "create" ? "Create User" : "Edit User"}
        </h1>

        <Link href="/users" className="text-sm text-brand-500 hover:underline">
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
                disabled={mode === "edit" && username === "superadmin"}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs disabled:opacity-70 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={mode === "edit" && username === "superadmin"}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs disabled:opacity-70 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password {mode === "edit" && "(leave blank to keep current)"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={mode === "create"}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create User"
                  : "Update User"}
              </button>

              <Link
                href="/users"
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
