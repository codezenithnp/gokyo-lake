import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { getAdminFromRequest } from "@/lib/auth";

const CATEGORIES = ["Rooms", "Restaurant", "Surroundings", "Hero", "Home", "About", "Blog"] as const;

const createSchema = z.object({
  imageUrl: z.string().url(),
  title: z.string().min(1),
  category: z.enum(CATEGORIES),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const query: Record<string, unknown> = {};
    if (category && CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      query.category = category;
    }
    const images = await GalleryImage.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, images });
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
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const image = await GalleryImage.create({
      imageUrl: parsed.data.imageUrl,
      title: parsed.data.title.trim(),
      category: parsed.data.category,
      description: parsed.data.description?.trim() || "",
      sortOrder: parsed.data.sortOrder ?? 0,
      isActive: parsed.data.isActive ?? true,
    });

    return NextResponse.json({ ok: true, image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
