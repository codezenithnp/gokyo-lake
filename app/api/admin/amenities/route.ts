import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Amenity } from "@/models/Amenity";
import { getAdminFromRequest } from "@/lib/auth";

const createAmenitySchema = z.object({
  name: z.string().min(2),
});

const normalizeName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const includeInactive = url.searchParams.get("includeInactive") === "1";

    await connectDB();
    const query = includeInactive ? {} : { isActive: true };
    const amenities = await Amenity.find(query).sort({ name: 1 }).lean();
    return NextResponse.json({ ok: true, amenities });
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
    const parsed = createAmenitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = normalizeName(parsed.data.name);
    const nameLower = name.toLowerCase();

    await connectDB();
    const existing = await Amenity.findOne({ nameLower }).lean();
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Amenity already exists." },
        { status: 409 }
      );
    }

    const amenity = await Amenity.create({ name, nameLower, isActive: true });
    return NextResponse.json({ ok: true, amenity }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
