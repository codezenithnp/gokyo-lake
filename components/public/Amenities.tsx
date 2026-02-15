'use client';

import { useEffect, useState } from 'react';
import { Wifi, Wind, Car, Droplets, Shirt, UtensilsCrossed, Coffee, Sparkles } from 'lucide-react';

type Amenity = {
  _id: string;
  name: string;
  description?: string;
  iconName?: string;
};

type Service = {
  _id: string;
  name: string;
  price?: number;
  description?: string;
};

type CombinedItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName?: string;
};

const iconMap: Record<string, any> = {
  wifi: Wifi,
  wind: Wind,
  car: Car,
  droplets: Droplets,
  shirt: Shirt,
  utensils: UtensilsCrossed,
  coffee: Coffee,
  sparkles: Sparkles,
};

const Amenities = () => {
  const [items, setItems] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [amenitiesRes, servicesRes] = await Promise.all([
          fetch('/api/public/amenities'),
          fetch('/api/public/services'),
        ]);

        const combined: CombinedItem[] = [];

        if (amenitiesRes.ok) {
          const amenitiesData = await amenitiesRes.json();
          const amenities: Amenity[] = Array.isArray(amenitiesData.amenities) 
            ? amenitiesData.amenities 
            : [];
          
          amenities.forEach(amenity => {
            combined.push({
              id: amenity._id,
              title: amenity.name,
              description: amenity.description || 'Included with your stay to ensure a seamless experience.',
              badge: 'Free',
              iconName: amenity.iconName,
            });
          });
        }

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          const services: Service[] = Array.isArray(servicesData.services) 
            ? servicesData.services 
            : [];
          
          services.forEach(service => {
            combined.push({
              id: service._id,
              title: service.name,
              description: service.description || 'Additional service available upon request.',
              badge: service.price ? `Rs. ${service.price}` : 'Contact Us',
            });
          });
        }

        setItems(combined);
      } catch (error) {
        console.error('Failed to load amenities or services', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getIcon = (iconName?: string) => {
    if (iconName && iconMap[iconName.toLowerCase()]) {
      const IconComponent = iconMap[iconName.toLowerCase()];
      return <IconComponent size={32} className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />;
    }
    return <Sparkles size={32} className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading amenities and services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-serif">
              Our Amenities & Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No amenities or services available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-serif">
            Our Amenities & Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience comfort and convenience with our wide range of amenities and services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getIcon(item.iconName)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    item.badge === 'Free'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
