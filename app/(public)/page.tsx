import { rooms } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section with Navbar */}
      <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <Navbar />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h2 className="text-2xl font-light">WELCOME TO</h2>
          <h1 className="text-7xl font-serif font-bold">Hotel Gokyo lake</h1>
          <p className="mt-4 text-lg">Book your stay and enjoy at the most affordable rates.</p>
          <div className="absolute bottom-10 flex flex-col items-center animate-bounce">
            <span>Scroll</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-4">FACILITIES</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            We want your stay at our lush hotel to be truly unforgettable. That is why we give special attention to all of your needs so that we can ensure an experience quite unique. Luxury hotels offers the perfect setting with stunning views for leisure and our modern luxury resort facilities will help you enjoy the best of all.
          </p>
          <div className="flex flex-col items-center space-y-16">
            {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="relative w-full max-w-5xl overflow-hidden rounded-xl shadow-lg"
      >
        {/* Image */}
        <Image
          src={`https://picsum.photos/seed/restaurant${i}/1200/520`}
          alt="Restaurant"
          width={1200}
          height={520}
          className="w-full h-[420px] object-cover"
        />

        {/* Dark overlay (ONLY over image) */}
        <div className="absolute inset-0 bg-black/35" />

    {/* Label card (always above overlay) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">

      <div className="rounded-md bg-white px-10 py-4 shadow-lg border border-gray-200">
        <h3 className="text-lg font-extrabold tracking-widest text-gray-900">
          RESTAURANT
        </h3>
        <p className="mt-1 text-xs font-medium text-gray-600 text-center">
          Dining & refreshments
        </p>
      </div>
    </div>
  </div>
))}

          </div>
        </div>
      </div>

      {/* Accommodation Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-8">Accommodation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.slice(0, 6).map((room) => (
              <div key={room.name} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image src={`https://picsum.photos/seed/${room.name}/400/300`} alt={room.name} width={400} height={300} className="w-full h-48 object-cover" />
                <div className="bg-blue-900 text-white p-3">
                  <h3 className="font-bold text-lg">{room.name.toUpperCase()}</h3>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="font-bold text-yellow-600">Rs. {room.price}</span>
                  <Link href="#" className="text-sm font-semibold text-blue-900 hover:underline">VIEW ROOM DETAILS</Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">All our room types are including complementary breakfast</p>
        </div>
      </div>

      {/* Luxury Redefined Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-serif mb-4">Luxury redefined</h2>
              <p className="text-gray-600 mb-6">
                Our rooms are designed to transport you into an environment made for leisure. Take your mind off the day-to-day of home life and find a private paradise for yourself.
              </p>
              <button className="bg-yellow-500 text-black px-8 py-3 font-bold hover:bg-yellow-400 rounded">EXPLORE</button>
            </div>
            <div>
              <Image src="https://picsum.photos/seed/luxury/600/400" alt="Luxury redefined" width={600} height={400} className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Leave your worries in the sand Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image src="https://picsum.photos/seed/beach/600/400" alt="Leave your worries in the sand" width={600} height={400} className="rounded-lg shadow-lg" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-serif mb-4">Leave your worries in the sand</h2>
              <p className="text-gray-600 mb-6">
                We love life at the beach. Being close to the ocean with access to endless sandy beach ensures a relaxed state of mind. It seems like time stands still watching the ocean.
              </p>
              <button className="bg-yellow-500 text-black px-8 py-3 font-bold hover:bg-yellow-400 rounded">EXPLORE</button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
          <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-8 text-gray-900">
            Testimonials
          </h2>

          <p className="mx-auto max-w-2xl text-lg italic text-gray-800">
            “Calm, Serene, Retro – What a way to relax and enjoy”
          </p>
          <p className="mt-3 text-sm font-semibold text-gray-600">Rizs - Nepal</p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="h-10 w-10 rounded bg-[#d7b16b] text-white text-2xl leading-none">
              ‹
            </button>
            <button className="h-10 w-10 rounded bg-[#d7b16b] text-white text-2xl leading-none">
              ›
            </button>
          </div>
        </div>
      </div>
      </div>
  );
};

export default HomePage;

