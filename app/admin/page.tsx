"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminInfo = {
  id: string;
  email: string;
  role: string;
};

type Stats = {
  totalRooms: number;
  activeRooms: number;
  totalBookings: number;
  confirmedBookings: number;
  canceledBookings: number;
  totalAmenities: number;
  totalServices: number;
};

type RecentBooking = {
  _id: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  status: string;
  roomId?: { _id: string; title?: string };
};

type ChartItem = {
  label: string;
  total: number;
  confirmed: number;
  canceled: number;
};

/* ── SVG Icon Components ── */
function IconBed() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function IconXCircle() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ── Bar Chart ── */
function BarChart({ data }: { data: ChartItem[] }) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="flex items-end gap-4 h-44 pt-4">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center flex-1 gap-1.5">
          <div className="flex flex-col items-center w-full gap-px" style={{ height: "130px" }}>
            <div
              className="w-full rounded-t-sm bg-[#1e293b] transition-all duration-300"
              style={{
                height: `${(item.confirmed / maxVal) * 100}%`,
                minHeight: item.confirmed > 0 ? "3px" : "0",
              }}
              title={`Confirmed: ${item.confirmed}`}
            />
            <div
              className="w-full rounded-b-sm bg-slate-300 transition-all duration-300"
              style={{
                height: `${(item.canceled / maxVal) * 100}%`,
                minHeight: item.canceled > 0 ? "3px" : "0",
              }}
              title={`Canceled: ${item.canceled}`}
            />
          </div>
          <span className="text-[11px] text-gray-400 whitespace-nowrap leading-none">{item.label}</span>
          <span className="text-[11px] font-medium text-gray-600 leading-none">{item.total}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Stat Card Config ── */
const statCards = [
  { key: "totalRooms", label: "Total Rooms", Icon: IconBed },
  { key: "confirmedBookings", label: "Confirmed", Icon: IconCheckCircle },
  { key: "canceledBookings", label: "Canceled", Icon: IconXCircle },
  { key: "totalAmenities", label: "Amenities", Icon: IconTag },
  { key: "totalServices", label: "Services", Icon: IconWrench },
  { key: "totalBookings", label: "All Bookings", Icon: IconClipboard },
] as const;

const quickLinks = [
  { label: "Rooms", href: "/admin/rooms", desc: "Manage hotel rooms" },
  { label: "Amenities", href: "/admin/amenities", desc: "Manage room amenities" },
  { label: "Services", href: "/admin/services", desc: "Manage hotel services" },
  { label: "Bookings", href: "/admin/bookings", desc: "View & manage bookings" },
];

const AdminPage = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const response = await fetch("/api/admin/me");
      if (!response.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setAdmin(data.admin);
    };

    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentBookings(data.recentBookings ?? []);
          setChartData(data.chartData ?? []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };

    fetchMe().catch(() => {
      setError("Unable to load admin profile.");
    });
    fetchDashboard();
  }, [router]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          {admin ? (
            <p className="mt-1 text-sm text-gray-500">
              {admin.email}{" "}
              <span className="ml-1 inline-block rounded border border-gray-200 bg-gray-50 px-1.5 py-px text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                {admin.role}
              </span>
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={async () => {
            setIsLoggingOut(true);
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
          }}
          className="rounded-md bg-[#1e293b] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#334155]"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statCards.map((card) => (
            <div
              key={card.key}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#1e293b]">
                  <card.Icon />
                </span>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                {stats[card.key as keyof Stats]}
              </div>
              <div className="mt-0.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                {card.label}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Chart + Recent Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {chartData.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Booking Trends</h2>
                <p className="mt-0.5 text-xs text-gray-400">Last {chartData.length} months</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-[#1e293b]" />
                  Confirmed
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-slate-300" />
                  Canceled
                </span>
              </div>
            </div>
            <BarChart data={chartData} />
          </div>
        ) : null}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
          <p className="mt-0.5 text-xs text-gray-400">Latest guest reservations</p>
          {recentBookings.length === 0 ? (
            <p className="mt-6 text-sm text-gray-400">No bookings yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-gray-100">
              {recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {b.guestName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {b.roomId && typeof b.roomId !== "string"
                        ? b.roomId.title
                        : "Room"}{" "}
                      &middot; {formatDate(b.checkIn)} &ndash; {formatDate(b.checkOut)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                      b.status === "CONFIRMED"
                    ? "bg-slate-100 text-[#1e293b] border border-slate-300"
                        : "bg-gray-50 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Quick Access</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm transition hover:border-slate-400 hover:shadow"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  {link.label}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">{link.desc}</p>
              </div>
              <span className="text-gray-300 transition group-hover:text-[#1e293b]">
                <IconArrowRight />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
