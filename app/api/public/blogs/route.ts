import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";

/** Public blog list – returns only published blogs */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (slug) {
      const blog = await Blog.findOne({ slug, status: "PUBLISHED" }).lean();
      if (!blog) {
        return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, blog });
    }

    const blogs = await Blog.find({ status: "PUBLISHED" })
      .select("title slug excerpt coverImage author createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, blogs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
