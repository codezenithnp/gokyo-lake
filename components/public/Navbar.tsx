import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 text-white bg-transparent">
      <div className="text-2xl font-bold font-serif">
        <Link href="/">GOKYO LAKE</Link>
      </div>
      <div className="hidden md:flex space-x-8 items-center">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        <Link href="/accommodation" className="hover:text-yellow-400">Accommodation</Link>
        <Link href="/contact-us" className="hover:text-yellow-400">Contact-us</Link>
      </div>
      <div>
        <button className="bg-yellow-500 text-black px-6 py-2 font-bold hover:bg-yellow-400 rounded">
          BOOK NOW
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
