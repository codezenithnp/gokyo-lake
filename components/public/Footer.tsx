import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold font-serif mb-2">GOKYO LAKE</h2>
            <p className="text-sm">Shree No. 5, Lakeside, Pokhara, Nepal</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">About Us</h3>
            <ul className="text-sm">
              <li><Link href="#" className="hover:underline">Contact</Link></li>
              <li><Link href="#" className="hover:underline">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Social</h3>
            <ul className="text-sm">
              <li><Link href="#" className="hover:underline">Facebook</Link></li>
              <li><Link href="#" className="hover:underline">Twitter</Link></li>
              <li><Link href="#" className="hover:underline">Instagram</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Subscribe to our Blogs</h3>
            <div className="flex">
              <input type="email" placeholder="Email Address" className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-full" />
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-r-md font-bold hover:bg-yellow-400">OK</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
