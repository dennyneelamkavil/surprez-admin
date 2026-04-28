import "server-only";

import bcrypt from "bcryptjs";

import { connectDB } from "@/server/db";

import { RoleModel } from "@/server/models/role.model";
import { UserModel } from "@/server/models/user.model";

export async function runBasicSeeder() {
  await connectDB();

  console.log("🌱 Running basic seeder...");

  /* ================= ROLE ================= */
  let superAdminRole = await RoleModel.findOne({ name: "superadmin" });

  if (!superAdminRole) {
    superAdminRole = await RoleModel.create({
      name: "superadmin",
      permissions: [],
      isSuperAdmin: true,
    });

    console.log("✅ Superadmin role created");
  } else {
    // ensure permissions are synced
    superAdminRole.isSuperAdmin = true;
    superAdminRole.permissions = [];
    await superAdminRole.save();

    console.log("♻️ Superadmin role updated");
  }

  /* ================= USER ================= */
  let superAdminUser = await UserModel.findOne({
    username: "superadmin",
  });

  if (!superAdminUser) {
    const passwordHash = await bcrypt.hash("A@123456", 12);

    await UserModel.create({
      username: "superadmin",
      password: passwordHash,
      fullname: "Super Admin",
      role: superAdminRole._id,
      isActive: true,
    });

    console.log("✅ Superadmin user created");
  } else {
    console.log("ℹ️ Superadmin user already exists");
  }

  console.log("🎉 Seeder completed");
}

// ======================================================
// 🔧 DEV NOTE: How to run this seeder
// ======================================================
//
// This seeder is not auto-executed.
// To run it when needed (e.g. fresh DB setup), create a temporary API route:
//
// File: app/api/dev/seed/route.ts
//
// import { NextResponse } from "next/server";
// import { runBasicSeeder } from "@/server/seeders/basic.seed";
//
// export async function GET() {
//   await runBasicSeeder();
//   return NextResponse.json({ success: true });
// }
//
// Then call:
// http://localhost:3000/api/dev/seed
//
// ⚠️ IMPORTANT:
// - Use ONLY in development
// - Delete or protect this route after use
//   (e.g. restrict with NODE_ENV !== "development")
//
// ======================================================
