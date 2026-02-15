import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { getAdminFromRequest } from "@/lib/auth";

const CATEGORIES = ["Rooms", "Restaurant", "Surroundings", "Hero", "Home", "About", "Blog"] as const;

const updateSchema = z.object({
  imageUrl: z.string().url().optional(),
  title: z.string().min(1).optional(),
  category: z.enum(CATEGORIES).optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

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
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const update: Record<string, unknown> = {};
    if (parsed.data.imageUrl !== undefined) update.imageUrl = parsed.data.imageUrl;
    if (parsed.data.title !== undefined) update.title = parsed.data.title.trim();
    if (parsed.data.category !== undefined) update.category = parsed.data.category;
    if (parsed.data.description !== undefined) update.description = parsed.data.description.trim();
    if (parsed.data.sortOrder !== undefined) update.sortOrder = parsed.data.sortOrder;
    if (parsed.data.isActive !== undefined) update.isActive = parsed.data.isActive;

    const image = await GalleryImage.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!image) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, image });
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
    const deleted = await GalleryImage.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
