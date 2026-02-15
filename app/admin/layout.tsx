"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Rooms", href: "/admin/rooms" },
  { label: "Calendar", href: "/admin/calendar" },
  { label: "Amenities", href: "/admin/amenities" },
  { label: "Services", href: "/admin/services" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Users", href: "/admin/users" },
];

const navPlaceholders: string[] = [];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <section className="min-h-screen bg-[color:var(--bg-soft)] flex items-center justify-center px-4">
        {children}
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-60 shrink-0 bg-[#1e293b]">
          <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
            <Image
              src="/images/logo-transparent.png"
              alt="Gokyo Lake Resort"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
                Gokyo Lake Resort
              </p>
              <h1 className="mt-0.5 text-sm font-semibold text-white">Admin Panel</h1>
            </div>
          </div>
          <nav className="mt-2 space-y-0.5 px-3 py-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="mt-3 border-t border-white/10 pt-3">
              {navPlaceholders.map((label) => (
                <span
                  key={label}
                  className="flex items-center rounded-md px-3 py-2 text-sm text-slate-500"
                >
                  {label}
                </span>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 text-gray-900">
          <div className="border-b border-gray-200 bg-white px-8 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                  Administration
                </p>
                <h2 className="text-sm font-semibold text-gray-700">
                  Hotel Operations
                </h2>
              </div>
              <a
                href="/"
                className="text-xs font-medium text-slate-500 hover:text-[#1e293b] transition"
              >
                View site &rarr;
              </a>
            </div>
          </div>
          <div className="px-8 py-8">{children}</div>
        </main>
      </div>
    </section>
  );
}
