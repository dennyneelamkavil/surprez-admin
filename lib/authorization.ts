export function hasPermission(
  role: {
    isSuperAdmin: boolean;
    permissions: string[];
  },
  permission: string
) {
  if (role.isSuperAdmin) return true;
  return role.permissions.includes(permission);
}
