import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold font-serif mb-4">GOKYO LAKE</h2>
            <p className="text-sm text-gray-400">
              Your serene escape in the heart of the Himalayas. Experience unparalleled hospitality and breathtaking views.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="text-gray-400 hover:text-white hover:underline">About Us</Link></li>
              <li><Link href="/amenities" className="text-gray-400 hover:text-white hover:underline">Amenities</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white hover:underline">Gallery</Link></li>
              <li><Link href="/policies" className="text-gray-400 hover:text-white hover:underline">Policies</Link></li>
               <li><Link href="/contact-us" className="text-gray-400 hover:text-white hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">Social</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white hover:underline">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:underline">Instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:underline">TripAdvisor</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Subscribe</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest updates and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your Email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-full text-sm" />
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-r-md font-bold hover:bg-yellow-400 text-sm">SUBMIT</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 text-center pt-6">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Hotel Gokyo Lake. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
