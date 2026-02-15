import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { Room } from "@/models/Room";
import { Booking } from "@/models/Booking";
import { Amenity } from "@/models/Amenity";
import { Service } from "@/models/Service";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const [
      totalRooms,
      activeRooms,
      totalBookings,
      confirmedBookings,
      canceledBookings,
      totalAmenities,
      totalServices,
      recentBookings,
      monthlyBookings,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "CONFIRMED" }),
      Booking.countDocuments({ status: "CANCELED" }),
      Amenity.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("roomId", "title")
        .lean(),
      Booking.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$checkIn" },
              month: { $month: "$checkIn" },
            },
            count: { $sum: 1 },
            confirmed: {
              $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] },
            },
            canceled: {
              $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, 1, 0] },
            },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
      ]),
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = monthlyBookings
      .reverse()
      .map(
        (item: {
          _id: { year: number; month: number };
          count: number;
          confirmed: number;
          canceled: number;
        }) => ({
          label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
          total: item.count,
          confirmed: item.confirmed,
          canceled: item.canceled,
        })
      );

    return NextResponse.json({
      ok: true,
      stats: {
        totalRooms,
        activeRooms,
        totalBookings,
        confirmedBookings,
        canceledBookings,
        totalAmenities,
        totalServices,
      },
      recentBookings,
      chartData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
