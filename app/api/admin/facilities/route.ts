import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Facility from "@/models/Facility";
import { getAdminFromRequest } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
});

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const facilities = await Facility.find().sort({ name: 1 }).lean();
    return NextResponse.json({ ok: true, facilities });
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
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await Facility.findOne({
      name: { $regex: new RegExp(`^${parsed.data.name.trim()}$`, "i") },
    }).lean();
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Facility already exists." },
        { status: 409 }
      );
    }

    const facility = await Facility.create({
      name: parsed.data.name.trim(),
      description: parsed.data.description.trim(),
    });
    return NextResponse.json({ ok: true, facility }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
