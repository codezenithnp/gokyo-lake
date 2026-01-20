import Image from "next/image";
import Link from "next/link";
import { FiEye, FiHome, FiHeart, FiMapPin } from "react-icons/fi";

const AboutUsPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
          About Hotel Gokyo Lake
        </h1>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-serif text-gray-800 mb-4">Our Story</h2>
            <p className="leading-relaxed mb-4">
              Nestled beside the tranquil waters of the third Gokyo Lake, our hotel was born from a passion for the Himalayas and a desire to offer a peaceful retreat. We aimed to create a sanctuary where travelers could rest, rejuvenate, and connect with the stunning natural beauty of the Everest region.
            </p>
            <p className="leading-relaxed">
              Hotel Gokyo Lake is more than just a place to stay; it's a home away from home for trekkers, adventurers, and peace-seekers alike. Our story is one of warm hospitality, sustainable tourism, and a deep respect for the local culture and environment.
            </p>
          </div>
          <div>
            <Image
              src="https://picsum.photos/seed/about-story-new/800/600"
              alt="View of Gokyo Lake from the hotel"
              width={800}
              height={600}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Mission & Values Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-serif text-gray-800 mb-8">Mission & Values</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="max-w-xs">
              <h3 className="font-bold text-xl mb-2">Guest-Centric Service</h3>
              <p>To provide exceptional and personalized service that exceeds expectations.</p>
            </div>
            <div className="max-w-xs">
              <h3 className="font-bold text-xl mb-2">Respect for Nature</h3>
              <p>To operate sustainably and promote the conservation of our pristine environment.</p>
            </div>
            <div className="max-w-xs">
              <h3 className="font-bold text-xl mb-2">Authentic Experience</h3>
              <p>To offer an authentic Himalayan experience rooted in local culture and warmth.</p>
            </div>
          </div>
        </div>

        {/* Why Stay With Us Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif text-center text-gray-800 mb-12">Why Stay With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FiEye size={28} />}
              title="Unmatched Lake View"
              description="Wake up to breathtaking, panoramic views of the sacred Gokyo Lake and surrounding peaks."
            />
            <FeatureCard
              icon={<FiHome size={28} />}
              title="Cozy & Clean Rooms"
              description="Our rooms are designed for comfort, offering a warm and inviting space to relax after a day of trekking."
            />
            <FeatureCard
              icon={<FiHeart size={28} />}
              title="Friendly Service"
              description="Our dedicated team is here to ensure your stay is comfortable, memorable, and feels like home."
            />
            <FeatureCard
              icon={<FiMapPin size={28} />}
              title="Great Location"
              description="Perfectly situated for acclimatization and exploring the upper Gokyo valley and its stunning lakes."
            />
          </div>
        </div>

        {/* CTA Strip */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Have Questions?</h3>
          <p className="text-gray-700 mb-6">Our team is ready to help you plan your perfect Himalayan getaway.</p>
          <Link href="/contact-us">
            <button className="bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-700 transition duration-300">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm border border-gray-200">
      <div className="flex justify-center text-yellow-600 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default AboutUsPage;
