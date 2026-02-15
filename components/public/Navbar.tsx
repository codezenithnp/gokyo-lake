'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to close the mobile menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHeroPage = pathname === '/' || pathname === '/accommodation';
  
  // Determine navbar theme based on page, scroll, and menu state
  const isTransparent = isHeroPage && !isScrolled && !isMenuOpen;
  
  const navTheme = isTransparent
    ? 'bg-transparent text-white'
    : 'bg-white/95 backdrop-blur-sm shadow-[0_10px_30px_-22px_rgba(11,58,91,0.55)] text-[color:var(--primary-blue)] border-b border-black/5';

  const linkHoverEffect = "lux-link transition-colors duration-300";

  const navLinks = [
    { href: '/', label: 'Home', type: 'primary' },
    { href: '/accommodation', label: 'Accommodation', type: 'primary' },
    { href: '/about-us', label: 'About Us', type: 'secondary' },
    { href: '/amenities', label: 'Amenities', type: 'secondary' },
    { href: '/gallery', label: 'Gallery', type: 'secondary' },
    { href: '/policies', label: 'Policies', type: 'secondary' },
    { href: '/blog', label: 'Blog', type: 'primary' },
    { href: '/contact-us', label: 'Contact Us', type: 'primary' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navTheme}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center">
          <Link href="/">
            <div className="relative h-20 w-64 md:h-24 md:w-80">
            <Image
              src="/images/logo-transparent.png"
              alt="Gokyo Lake"
              fill
              className="object-contain"
              priority
            />
          </div>


          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.filter(link => link.type === 'primary').map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-semibold leading-6 tracking-[0.2em] uppercase ${linkHoverEffect}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          <Link
            href="/booking"
            className="lux-btn rounded-md bg-[color:var(--gold)] px-5 py-2.5 text-xs font-semibold tracking-[0.3em] uppercase text-[color:var(--primary-blue)] shadow-[0_10px_22px_-18px_rgba(11,58,91,0.7)] hover:bg-[#dfbf7f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-sm text-[color:var(--primary-blue)]">
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-[color:var(--bg-soft)] text-[color:var(--primary-blue)]'
                    : 'text-[color:var(--primary-blue)] hover:bg-[color:var(--bg-soft)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 py-4">
              <Link
                href="/booking"
                className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-[color:var(--bg-soft)]"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
