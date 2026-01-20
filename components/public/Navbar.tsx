'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

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
    : 'bg-white/95 backdrop-blur-sm shadow-md text-gray-800';

  const logoColor = isTransparent ? 'text-white' : 'text-gray-900';

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
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:px-8">
        <div className={`text-2xl font-bold font-serif transition-colors duration-300 ${logoColor}`}>
          <Link href="/">GOKYO LAKE</Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isPrimary = link.type === 'primary';

            // Define colors based on the dynamic theme
            const baseColor = isTransparent ? 'text-white' : 'text-gray-900';
            const activeColor = 'text-yellow-400';
            const hoverColor = isTransparent ? 'hover:text-white' : 'hover:text-gray-900';

            const linkClasses = [
              'relative', 'transition-colors', 'text-sm', hoverColor,
              isActive ? `${activeColor} font-semibold` : baseColor,
              isPrimary ? 'font-semibold' : 'font-normal',
              !isPrimary && !isActive && (isTransparent ? 'opacity-80' : 'text-gray-600')
            ].filter(Boolean).join(' ');

            return (
              <Link key={link.href} href={link.href} className={linkClasses}>
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-400 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/booking"
            className="bg-yellow-500 text-black px-5 py-2.5 font-bold hover:bg-yellow-400 rounded-lg text-sm transition-colors hidden md:block"
          >
            BOOK NOW
          </a>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`h-6 w-6 transition-colors duration-300 ${logoColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 mt-2">
              <a
                href="/booking"
                className="block w-full text-center bg-yellow-500 text-black px-6 py-3 font-bold hover:bg-yellow-400 rounded-lg text-base"
              >
                BOOK NOW
              </a>
            </div>
          </div>
        </div>
    </header>
  );
};

export default Navbar;