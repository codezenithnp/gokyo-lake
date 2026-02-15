import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[color:var(--primary-blue)] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* About Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src="/images/logo-transparent.png"
                alt="Gokyo Lake"
                width={140}
                height={40}
                className="h-auto mb-4"
              />
            </Link>
            <p className="text-sm text-white/75 leading-relaxed">
              Your serene escape in the heart of the Himalayas. Experience unparalleled hospitality and breathtaking views.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-[0.2em] uppercase">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about-us" className="text-white/75 hover:text-white transition-colors lux-link">About Us</Link></li>
              <li><Link href="/amenities" className="text-white/75 hover:text-white transition-colors lux-link">Amenities</Link></li>
              <li><Link href="/gallery" className="text-white/75 hover:text-white transition-colors lux-link">Gallery</Link></li>
              <li><Link href="/policies" className="text-white/75 hover:text-white transition-colors lux-link">Policies</Link></li>
              <li><Link href="/contact-us" className="text-white/75 hover:text-white transition-colors lux-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4 tracking-[0.2em] uppercase">Social</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://www.facebook.com/hotelgokyolake" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className="text-white/75 hover:text-white transition-colors lux-link"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/hotelgokyolake/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  className="text-white/75 hover:text-white transition-colors lux-link"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/9779841598973" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="WhatsApp"
                  className="text-white/75 hover:text-white transition-colors lux-link"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-[0.2em] uppercase">Subscribe</h3>
            <p className="text-sm text-white/75 mb-4">Get the latest updates and offers.</p>
            <form className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-white/10 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)] mb-2 sm:mb-0 sm:rounded-r-none text-sm" 
              />
              <button 
                type="submit"
                className="lux-btn bg-[color:var(--gold)] text-[color:var(--primary-blue)] px-4 py-2.5 rounded-md font-bold hover:bg-[#dfbf7f] text-sm sm:rounded-l-none whitespace-nowrap"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 text-center mt-12 pt-8">
          <p className="text-xs text-white/55">&copy; {new Date().getFullYear()} Hotel Gokyo Lake. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
