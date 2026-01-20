import Image from "next/image";

const images = [
  { src: "https://picsum.photos/seed/g-room1/800/600", category: "Rooms" },
  { src: "https://picsum.photos/seed/g-surround1/800/600", category: "Surroundings" },
  { src: "https://picsum.photos/seed/g-resto1/800/600", category: "Restaurant" },
  { src: "https://picsum.photos/seed/g-room2/800/600", category: "Rooms" },
  { src: "https://picsum.photos/seed/g-surround2/800/600", category: "Surroundings" },
  { src: "https://picsum.photos/seed/g-resto2/800/600", category: "Restaurant" },
  { src: "https://picsum.photos/seed/g-room3/800/600", category: "Rooms" },
  { src: "https://picsum.photos/seed/g-surround3/800/600", category: "Surroundings" },
  { src: "https://picsum.photos/seed/g-resto3/800/600", category: "Restaurant" },
  { src: "https://picsum.photos/seed/g-room4/800/600", category: "Rooms" },
  { src: "https://picsum.photos/seed/g-surround4/800/600", category: "Surroundings" },
  { src: "https://picsum.photos/seed/g-detail1/800/600", category: "Rooms" },
];

const GalleryPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-gray-700 max-w-3xl mx-auto mb-10">
            Explore the beauty of Hotel Gokyo Lake and its stunning surroundings through our curated gallery.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex justify-center gap-2 md:gap-4 mb-10">
          <button className="bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full text-sm">All</button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full text-sm hover:bg-gray-300">Rooms</button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full text-sm hover:bg-gray-300">Restaurant</button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full text-sm hover:bg-gray-300">Surroundings</button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg group">
              <Image
                src={image.src}
                alt={`${image.category} - Image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
