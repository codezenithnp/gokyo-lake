"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  delay?: number;
};

const Reveal = ({ children, className, delay = 0, style, ...props }: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mergedStyle = { ...(style ?? {}), ["--reveal-delay" as string]: `${delay}ms` };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={ref}
      className={cn(
        mounted && "reveal",
        mounted && isVisible && "is-visible",
        className
      )}
      style={mergedStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default Reveal;
