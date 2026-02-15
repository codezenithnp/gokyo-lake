"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHeroPage = pathname === "/" || pathname === "/accommodation";
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isHeroPage) return;
    const root = mainRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealTargets = Array.from(
      root.querySelectorAll(
        "section, .container > div, .grid > div, .rounded-lg, .rounded-xl, .shadow-lg, .shadow-md"
      )
    );

    revealTargets.forEach((el) => el.classList.add("reveal"));

    if (prefersReducedMotion) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));

    const buttonTargets = Array.from(root.querySelectorAll("button"));
    buttonTargets.forEach((el) => el.classList.add("cinematic-btn", "lux-btn"));

    return () => observer.disconnect();
  }, [isHeroPage, pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[color:var(--bg-soft)] text-[color:var(--text-ink)]">
      <Navbar />
      <main
        ref={mainRef}
        className={`flex-grow ${isHeroPage ? "" : "pt-24 non-hero"}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
