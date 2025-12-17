import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/server/services/user.service";

export const runtime = "nodejs";

const Schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Signup failed" },
      { status: 400 }
    );
  }
}
