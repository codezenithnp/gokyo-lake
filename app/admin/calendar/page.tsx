"use client";

import { useEffect, useState, useCallback } from "react";

/* ---------- types ---------- */
type RoomRef = { _id: string; title: string };
type Booking = {
  _id: string;
  roomId: RoomRef | string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  status: string;
};

/* ---------- helpers ---------- */
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ROOM_COLORS = [
  { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-800", dot: "bg-blue-600" },
  { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800", dot: "bg-emerald-600" },
  { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800", dot: "bg-amber-600" },
  { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-800", dot: "bg-purple-600" },
  { bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-800", dot: "bg-rose-600" },
  { bg: "bg-cyan-50", border: "border-cyan-300", text: "text-cyan-800", dot: "bg-cyan-600" },
  { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-800", dot: "bg-orange-600" },
  { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-800", dot: "bg-indigo-600" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function monthKey(year: number, month: number) {
  return `${year}-${pad(month + 1)}`;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function roomId(b: Booking): string {
  return typeof b.roomId === "string" ? b.roomId : b.roomId?._id ?? "";
}

function roomTitle(b: Booking): string {
  return typeof b.roomId === "string" ? "Room" : b.roomId?.title ?? "Room";
}

/** Build array of dates in [checkIn, checkOut) */
function bookingDates(b: Booking): string[] {
  const dates: string[] = [];
  const start = new Date(b.checkIn);
  const end = new Date(b.checkOut);
  const d = new Date(start);
  while (d < end) {
    dates.push(dateKey(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

/* ---------- component ---------- */
export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rooms, setRooms] = useState<RoomRef[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [popup, setPopup] = useState<{ date: string; bookings: Booking[] } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/calendar?month=${monthKey(year, month)}`);
      if (!res.ok) return;
      const data = await res.json();
      setRooms(data.rooms ?? []);
      setBookings(data.bookings ?? []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* nav */
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  /* color map for rooms */
  const roomColorMap: Record<string, (typeof ROOM_COLORS)[number]> = {};
  rooms.forEach((r, i) => { roomColorMap[r._id] = ROOM_COLORS[i % ROOM_COLORS.length]; });

  /* build calendar grid */
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  /* bookings per date */
  const filtered = selectedRoom === "all"
    ? bookings
    : bookings.filter((b) => roomId(b) === selectedRoom);

  const dateBookingMap: Record<string, Booking[]> = {};
  filtered.forEach((b) => {
    bookingDates(b).forEach((dk) => {
      if (!dateBookingMap[dk]) dateBookingMap[dk] = [];
      dateBookingMap[dk].push(b);
    });
  });

  const todayKey = dateKey(today);

  /* stats */
  const totalRooms = rooms.length;
  const todayBookings = dateBookingMap[todayKey]?.length ?? 0;
  const bookedRoomsToday = new Set(dateBookingMap[todayKey]?.map((b) => roomId(b)) ?? []).size;
  const availableToday = totalRooms - bookedRoomsToday;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Room Availability Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">View and track room bookings across dates</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
          >
            <option value="all">All Rooms</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>{r.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Rooms" value={totalRooms} />
        <StatCard label="Booked Today" value={bookedRoomsToday} />
        <StatCard label="Available Today" value={availableToday} />
        <StatCard label="Bookings Today" value={todayBookings} />
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-lg overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-white">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-50 transition" aria-label="Previous month">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={goToday} className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 transition">
              Today
            </button>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-50 transition" aria-label="Next month">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading calendar…</div>
        ) : (
          <div className="p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-3">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide py-2">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-300 rounded-xl overflow-hidden">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - firstDay + 1;
                const isValid = dayNum >= 1 && dayNum <= daysInMonth;
                const dk = isValid ? `${year}-${pad(month + 1)}-${pad(dayNum)}` : "";
                const isToday = dk === todayKey;
                const dayBookings = dk ? (dateBookingMap[dk] ?? []) : [];
                const hasBookings = dayBookings.length > 0;
                const isPast = isValid && new Date(year, month, dayNum) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!isValid}
                    onClick={() => {
                      if (isValid && hasBookings) setPopup({ date: dk, bookings: dayBookings });
                    }}
                    className={`relative min-h-[90px] p-1.5 text-left transition-all duration-200 ${
                      !isValid
                        ? "bg-gray-50"
                        : hasBookings
                        ? "bg-white hover:bg-gray-50 cursor-pointer"
                        : "bg-white hover:bg-gray-50"
                    } ${isToday ? "ring-2 ring-inset ring-blue-600" : ""}`}
                  >
                    {isValid && (
                      <>
                        <span className={`text-sm font-medium ${
                          isToday ? "bg-blue-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center" :
                          isPast ? "text-gray-400" : "text-slate-900"
                        }`}>
                          {dayNum}
                        </span>

                        {/* Booking chips */}
                        <div className="mt-1 space-y-0.5">
                          {dayBookings.slice(0, 3).map((b) => {
                            const color = roomColorMap[roomId(b)] ?? ROOM_COLORS[0];
                            return (
                              <div
                                key={b._id}
                                className={`text-[10px] leading-tight font-medium px-2 py-1 rounded-full ${color.bg} ${color.text} truncate`}
                              >
                                {roomTitle(b)}
                              </div>
                            );
                          })}
                          {dayBookings.length > 3 && (
                            <div className="text-[10px] text-gray-600 font-medium pl-1">
                              +{dayBookings.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Room Legend */}
      <div className="mt-6 bg-white rounded-xl border border-gray-300 shadow-lg p-6">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-4">Room Legend</h3>
        <div className="flex flex-wrap gap-3">
          {rooms.map((r) => {
            const color = roomColorMap[r._id] ?? ROOM_COLORS[0];
            return (
              <button
                key={r._id}
                type="button"
                onClick={() => setSelectedRoom(selectedRoom === r._id ? "all" : r._id)}
                className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                  selectedRoom === r._id
                    ? `${color.bg} ${color.border} ${color.text}`
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                {r.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popup / Detail Modal */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setPopup(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-white">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {new Date(popup.date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {popup.bookings.length} booking{popup.bookings.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button onClick={() => setPopup(null)} className="p-1.5 hover:bg-gray-50 rounded-lg transition" aria-label="Close">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Booking details */}
            <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-3">
              {popup.bookings.map((b) => {
                const color = roomColorMap[roomId(b)] ?? ROOM_COLORS[0];
                const checkInDate = new Date(b.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const checkOutDate = new Date(b.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div key={b._id} className={`rounded-xl border ${color.border} ${color.bg} p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className={`font-semibold text-sm ${color.text}`}>{roomTitle(b)}</p>
                        <p className="text-xs text-gray-700 mt-0.5">{b.guestName}</p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-full text-gray-700">
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {checkInDate} → {checkOutDate}
                      </div>
                      {b.guestEmail && (
                        <div className="flex items-center gap-1 truncate">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="truncate">{b.guestEmail}</span>
                        </div>
                      )}
                      {b.guestPhone && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {b.guestPhone}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- stat card ---------- */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-lg p-6">
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  );
}
