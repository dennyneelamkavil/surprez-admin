import type { RoleWithPermissionKeys } from "@/lib/types";

export function hasPermission(
  role: RoleWithPermissionKeys | undefined,
  permission: string
) {
  if (!role) return false;
  if (role.isSuperAdmin) return true;
  return role.permissions.includes(permission);
}
