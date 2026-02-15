import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { getAdminFromRequest } from "@/lib/auth";

const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

const normalizeName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const update: {
      name?: string;
      nameLower?: string;
      price?: number;
      description?: string;
      isActive?: boolean;
    } = {};

    if (typeof parsed.data.name === "string") {
      const name = normalizeName(parsed.data.name);
      const nameLower = name.toLowerCase();
      const exists = await Service.findOne({
        nameLower,
        _id: { $ne: id },
      }).lean();
      if (exists) {
        return NextResponse.json(
          { ok: false, error: "Service already exists." },
          { status: 409 }
        );
      }
      update.name = name;
      update.nameLower = nameLower;
    }

    if (typeof parsed.data.price === "number") {
      update.price = parsed.data.price;
    }

    if (typeof parsed.data.description === "string") {
      update.description = parsed.data.description.trim() || undefined;
    }

    if (typeof parsed.data.isActive === "boolean") {
      update.isActive = parsed.data.isActive;
    }

    const service = await Service.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!service) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, service });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const admin = await getAdminFromRequest(_);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!service) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
