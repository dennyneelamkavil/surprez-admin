"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeCloseIcon, EyeIcon } from "@/icons";

import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/button/Button";
import FormHeader from "@/components/form/FormHeader";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

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
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9_]/g, "");

    setUsername(value);
  };

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const isSuperAdminEdit = mode === "edit" && username === "superadmin";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <FormHeader
        title={mode === "create" ? "Create User" : "Edit User"}
        backHref="/users"
      />

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10">
                {error}
              </div>
            )}

            <FormField label="Username" required htmlFor="username">
              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={handleUsernameChange}
                required
                disabled={isSuperAdminEdit}
              />
            </FormField>

            <FormField label="Role" required>
              <Select
                options={roleOptions}
                value={role}
                placeholder="Select role"
                onChange={setRole}
                disabled={isSuperAdminEdit}
              />
            </FormField>

            <FormField label="Full Name" required htmlFor="fullname">
              <Input
                id="fullname"
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Email" required htmlFor="email">
              <Input
                id="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField
              label={`Password ${
                mode === "edit" ? "(leave blank to keep current)" : ""
              }`}
              htmlFor="password"
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={mode === "create"}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              </div>
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create User"
                  : "Update User"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users")}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
