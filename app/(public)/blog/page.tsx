import React from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Exploring the Everest Base Camp Trail',
    excerpt: 'A journey through the stunning landscapes of the Khumbu region, leading to the base of the world\'s highest peak.',
    date: 'October 28, 2025',
    imageUrl: 'https://picsum.photos/seed/everest/800/600',
  },
  {
    id: 2,
    title: 'The Serenity of Gokyo Lakes',
    excerpt: 'Discover the tranquil beauty of the six sacred lakes in the Gokyo Valley, a less-trodden path in the Everest region.',
    date: 'November 15, 2025',
    imageUrl: 'https://picsum.photos/seed/gokyo/800/600',
  },
  {
    id: 3,
    title: 'Acclimatization Tips for High-Altitude Treks',
    excerpt: 'Learn how to stay safe and healthy while trekking at high altitudes to make the most of your Himalayan adventure.',
    date: 'September 5, 2025',
    imageUrl: 'https://picsum.photos/seed/trekking/800/600',
  },
  {
    id: 4,
    title: 'A Guide to Teahouse Trekking in Nepal',
    excerpt: 'Experience the warmth of Nepali hospitality. A look into the culture of teahouse trekking.',
    date: 'August 20, 2025',
    imageUrl: 'https://picsum.photos/seed/teahouse/800/600',
  },
];

const BlogPage = () => {
  return (
    <div className="bg-gray-100 text-gray-800 pt-24">

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.date}</p>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <a href="#" className="text-yellow-500 hover:text-yellow-600 font-bold">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;