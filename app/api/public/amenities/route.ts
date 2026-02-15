import { NextResponse } from "next/server";
import { Amenity } from "@/models/Amenity";
import { connectDB } from "@/lib/db";

export const GET = async () => {
  try {
    await connectDB();
    const amenities = await Amenity.find({});
    return NextResponse.json({ amenities });
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch amenities" },
      { status: 500 }
    );
  }
};
