import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ ok: true, services });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
