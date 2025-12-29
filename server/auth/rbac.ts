import "server-only";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { authOptions } from "@/server/auth/config";
import { Role } from "@/lib/types";

type JwtPayload = {
  sub: string;
  username: string;
  role: Role;
};

export async function requirePermission(permission: string) {
  // 1️⃣ Try NextAuth session (browser)
  const session = await getServerSession(authOptions);

  let role: Role | undefined;

  if (session?.user?.role) {
    role = session.user.role;
  }

  // 2️⃣ Fallback to Bearer token (Postman / API)
  if (!role) {
    const hdrs = await headers();
    const authHeader = hdrs.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      role = decoded.role;
    }
  }

  // 3️⃣ No auth at all
  if (!role) {
    throw new Error("Unauthorized");
  }

  // 4️⃣ Super admin bypass
  if (role.isSuperAdmin) {
    return;
  }

  // 5️⃣ Permission check
  const hasPermission = role.permissions?.includes(permission);

  if (!hasPermission) {
    throw new Error("Forbidden");
  }
}
