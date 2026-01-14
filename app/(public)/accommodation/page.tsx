import Image from "next/image";
import Link from "next/link";

const roomsData = [
  {
    name: "SINGLE ROOM",
    price: 147,
    image: "https://picsum.photos/seed/single-room/1200/600",
  },
  {
    name: "DOUBLE ROOM",
    price: 155,
    image: "https://picsum.photos/seed/double-room/1200/600",
  },
  {
    name: "TWIN ROOM",
    price: 155,
    image: "https://picsum.photos/seed/twin-room/1200/600",
  },
];

const AccommodationPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://picsum.photos/seed/accom-hero/1920/1080')",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h2 className="text-2xl font-light tracking-widest">WELCOME TO</h2>
          <h1 className="text-6xl md:text-7xl font-serif font-bold drop-shadow-lg">
            Hotel Gokyo lake
          </h1>
          <p className="mt-4 text-lg text-white/90 drop-shadow">
            Book your stay and enjoy at the most affordable rates.
          </p>

          <div className="absolute bottom-10 flex flex-col items-center animate-bounce">
            <span className="text-white/90">Scroll</span>
            <div className="mt-2 w-8 h-8 border-2 border-white/80 rounded-full flex items-center justify-center bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms and Rates Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-4 text-gray-900">
            ROOMS AND RATES
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 mb-16">
            We want your stay at our lush hotel to be truly unforgettable. That
            is why we give special attention to all of your needs so that we can
            ensure an experience quite unique.
          </p>

          <div className="flex flex-col items-center space-y-12">
            {roomsData.map((room, index) => (
              <div
                key={index}
                className="w-full max-w-5xl border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <div className="relative">
                  <Image
                    src={room.image}
                    alt={room.name}
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                  />

                  {/* dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    <div
                      className={`w-2.5 h-2.5 ${
                        index === 0 ? "bg-white" : "bg-white/40"
                      } rounded-full`}
                    />
                    <div
                      className={`w-2.5 h-2.5 ${
                        index === 1 ? "bg-white" : "bg-white/40"
                      } rounded-full`}
                    />
                    <div
                      className={`w-2.5 h-2.5 ${
                        index === 2 ? "bg-white" : "bg-white/40"
                      } rounded-full`}
                    />
                  </div>
                </div>

                {/* blue strip */}
                <div className="bg-[#0f5f7a] text-white p-4 text-center">
                  <h3 className="font-bold text-2xl tracking-wider">
                    {room.name}
                  </h3>
                </div>

                {/* bottom row */}
                <div className="p-6 bg-white flex justify-between items-center">
                  <Link
                    href="/accommodation"
                    className="flex items-center font-semibold text-gray-900 hover:text-black hover:underline"
                  >
                    <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-800">
                      +
                    </span>
                    VIEW ROOM DETAILS
                  </Link>

                  <span className="bg-[#d7b16b] text-white px-4 py-2 font-bold rounded-full text-sm">
                    ${room.price} Avg/night
                  </span>
                </div>
              </div>
            ))}
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

export default AccommodationPage;
