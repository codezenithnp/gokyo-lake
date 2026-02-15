import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
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

const updateBlogSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  author: z.string().max(100).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, blog });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const update: Record<string, unknown> = {};

    if (parsed.data.title !== undefined) {
      const title = parsed.data.title.trim();
      update.title = title;
      let slug = slugify(title);
      let existing = await Blog.findOne({ slug, _id: { $ne: id } }).lean();
      let counter = 1;
      while (existing) {
        slug = `${slugify(title)}-${counter}`;
        existing = await Blog.findOne({ slug, _id: { $ne: id } }).lean();
        counter++;
      }
      update.slug = slug;
    }

    if (parsed.data.excerpt !== undefined) update.excerpt = parsed.data.excerpt.trim();
    if (parsed.data.content !== undefined) update.content = parsed.data.content;
    if (parsed.data.coverImage !== undefined) update.coverImage = parsed.data.coverImage.trim();
    if (parsed.data.status !== undefined) update.status = parsed.data.status;
    if (parsed.data.author !== undefined) update.author = parsed.data.author.trim();

    const blog = await Blog.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!blog) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, blog });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const deleted = await Blog.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
