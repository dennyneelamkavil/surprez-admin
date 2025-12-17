export function hasPermission(
  user: {
    role: {
      isSuperAdmin: boolean;
      permissions: string[];
    };
  },
  permission: string
) {
  if (user.role.isSuperAdmin) return true;
  return user.role.permissions.includes(permission);
}
