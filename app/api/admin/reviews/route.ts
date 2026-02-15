import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import "@/models/Room";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    await connectDB();
    const query = status && status !== "all" ? { status } : {};
    const reviews = await Review.find(query)
      .populate("roomId", "title")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ ok: true, reviews });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
