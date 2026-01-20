'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar = () => {
  const pathname = usePathname();

  const isHeroPage = pathname === '/' || pathname.startsWith('/accommodation');

  const navTheme = isHeroPage
    ? 'text-white bg-transparent'
    : 'bg-white/90 backdrop-blur-sm shadow-md';
  
  const primaryLinkColor = isHeroPage ? 'text-white' : 'text-gray-800';
  const secondaryLinkColor = isHeroPage ? 'text-white/80' : 'text-gray-500';
  const activeLinkColor = isHeroPage ? 'text-yellow-400' : 'text-yellow-600';
  const logoColor = isHeroPage ? 'text-white' : 'text-gray-900';

  const navLinks = [
    { href: '/', label: 'Home', type: 'primary' },
    { href: '/accommodation', label: 'Accommodation', type: 'primary' },
    { href: '/about-us', label: 'About Us', type: 'secondary' },
    { href: '/amenities', label: 'Amenities', type: 'secondary' },
    { href: '/gallery', label: 'Gallery', type: 'secondary' },
    { href: '/policies', label: 'Policies', type: 'secondary' },
    { href: '/blog', label: 'Blog', type: 'primary', divider: true },
    { href: '/contact-us', label: 'Contact-us', type: 'primary' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-6 transition-colors duration-300 ${navTheme}`}>
      <div className={`text-2xl font-bold font-serif ${logoColor}`}>
        <Link href="/">GOKYO LAKE</Link>
      </div>
      <div className="hidden md:flex space-x-6 items-center">
        {navLinks.map((link) => {
          const isPrimary = link.type === 'primary';
          const isActive = pathname === link.href;

          const linkClass = isActive
            ? activeLinkColor + ' font-semibold'
            : isPrimary
            ? primaryLinkColor + ' font-semibold'
            : secondaryLinkColor + ' font-normal';

          return (
            <React.Fragment key={link.href}>
              {link.divider && (
                <span className="border-l border-white/40 h-4 mx-1"></span>
              )}
              <Link
                href={link.href}
                className={`${linkClass} hover:text-yellow-400 transition-colors text-sm`}
              >
                {link.label}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
      <div>
        <a
          href="/booking"
          className="bg-yellow-500 text-black px-6 py-2 font-bold hover:bg-yellow-400 rounded text-sm"
        >
          BOOK NOW
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
