import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { getAdminFromRequest } from "@/lib/auth";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const createBlogSchema = z.object({
  title: z.string().min(2).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  author: z.string().max(100).optional(),
});

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status === "DRAFT" || status === "PUBLISHED") {
      query.status = status;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, blogs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const title = parsed.data.title.trim();
    let slug = slugify(title);

    await connectDB();

    // Ensure unique slug
    let existing = await Blog.findOne({ slug }).lean();
    let counter = 1;
    while (existing) {
      slug = `${slugify(title)}-${counter}`;
      existing = await Blog.findOne({ slug }).lean();
      counter++;
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt: parsed.data.excerpt?.trim() || "",
      content: parsed.data.content || "",
      coverImage: parsed.data.coverImage?.trim() || "",
      status: parsed.data.status || "DRAFT",
      author: parsed.data.author?.trim() || "Admin",
    });

    return NextResponse.json({ ok: true, blog }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
