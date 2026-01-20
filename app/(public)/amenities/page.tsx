const amenities = [
  {
    emoji: "🍽️",
    title: "In-House Restaurant",
    description: "Enjoy delicious local and international cuisine at our cozy restaurant.",
  },
  {
    emoji: "📶",
    title: "Free Wi-Fi",
    description: "Stay connected with complimentary high-speed internet access for all guests.",
  },
  {
    emoji: "🅿️",
    title: "Parking Area",
    description: "Safe and secure parking space available for vehicles (limited availability).",
  },
  {
    emoji: "🛎️",
    title: "Room Service",
    description: "Dine in the comfort of your room with our prompt room service.",
  },
  {
    emoji: "🚿",
    title: "Hot Shower",
    description: "Relax and rejuvenate with a guaranteed hot shower after a long day's trek.",
  },
  {
    emoji: "🧺",
    title: "Laundry Service",
    description: "Keep your trekking gear fresh with our professional laundry service.",
  },
  {
    emoji: "🏔️",
    title: "Mountain View",
    description: "Select rooms offer stunning, direct views of the Himalayan peaks.",
  },
  {
    emoji: "🕒",
    title: "24/7 Support",
    description: "Our front desk is available around the clock to assist you with any needs.",
  },
];

const AmenitiesPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Amenities & Services
          </h1>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12">
            We are committed to providing you with the best facilities to make your stay comfortable and memorable. From dining to connectivity, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <div key={amenity.title} className="bg-gray-50 p-8 rounded-lg text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{amenity.emoji}</div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">{amenity.title}</h3>
              <p className="text-gray-600 text-sm">{amenity.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 italic">
            Please note: Amenities may vary by room type.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesPage;
