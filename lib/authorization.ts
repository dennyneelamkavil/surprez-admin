import { Role } from "@/lib/types";

export function hasPermission(role: Role | undefined, permission: string) {
  if (!role) return false;
  if (role.isSuperAdmin) return true;
  return role.permissions?.includes(permission) ?? false;
}
