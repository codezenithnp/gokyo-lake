import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

export async function POST() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "Not found." },
        { status: 404 }
      );
    }

    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_EMAIL or ADMIN_PASSWORD is missing." },
        { status: 500 }
      );
    }

    await connectDB();

    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();
    const existing = await AdminUser.findOne({
      email: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    }).lean();
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    if (existing) {
      await AdminUser.updateOne(
        { email: existing.email },
        { $set: { passwordHash, email: normalizedEmail } }
      );
      return NextResponse.json({
        ok: true,
        message: "Admin password updated",
      });
    }

    await AdminUser.create({ email: normalizedEmail, passwordHash });

    // TODO: Remove this dev-only route after seeding the initial admin.
    return NextResponse.json({ ok: true, message: "Admin user created" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
