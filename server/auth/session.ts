import { authOptions } from "./config";
import { getServerSession } from "next-auth";

// export this helper so you can use `auth()` anywhere
export async function auth() {
  return getServerSession(authOptions);
}
