import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* About Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold font-serif mb-4">GOKYO LAKE</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your serene escape in the heart of the Himalayas. Experience unparalleled hospitality and breathtaking views.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about-us" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/amenities" className="text-gray-400 hover:text-white transition-colors">Amenities</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/policies" className="text-gray-400 hover:text-white transition-colors">Policies</Link></li>
              <li><Link href="/contact-us" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4 tracking-wider">Social</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://www.facebook.com/hotelgokyolake" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-white transition-colors"
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">TripAdvisor</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-wider">Subscribe</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest updates and offers.</p>
            <form className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-2 sm:mb-0 sm:rounded-r-none text-sm" 
              />
              <button 
                type="submit"
                className="bg-yellow-500 text-black px-4 py-2.5 rounded-md font-bold hover:bg-yellow-400 text-sm sm:rounded-l-none whitespace-nowrap"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 text-center mt-12 pt-8">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Hotel Gokyo Lake. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
