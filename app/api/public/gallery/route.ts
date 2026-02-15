import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

/** Public gallery endpoint – returns only active images */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const query: Record<string, unknown> = { isActive: true };
    if (category) query.category = category;

    const images = await GalleryImage.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
