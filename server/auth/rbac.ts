import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";

export async function requirePermission(permission: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const role = session.user.role;

  if (role.isSuperAdmin) {
    return session;
  }

  const hasPermission = role.permissions?.includes(permission);

  if (!hasPermission) {
    throw new Error("Forbidden");
  }

  return session;
}
