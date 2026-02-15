import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await getAdminFromRequest(req);

  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    admin: { id: admin.adminId, email: admin.email, role: admin.role },
  });
}
