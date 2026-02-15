"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { isCloudinaryUrl } from "@/lib/image";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  createdAt: string;
};

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/public/blogs");
        if (!res.ok) return;
        const data = await res.json();
        setPosts(Array.isArray(data.blogs) ? data.blogs : []);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gray-100 text-gray-800 pt-24">
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-10">Our Blog</h1>

        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No blog posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden lux-card">
                {post.coverImage ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized={isCloudinaryUrl(post.coverImage)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {post.author ? ` · ${post.author}` : ""}
                  </p>
                  {post.excerpt && <p className="text-gray-700 mb-4">{post.excerpt}</p>}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="lux-btn rounded-full border border-yellow-500/60 px-4 py-1.5 text-sm font-semibold text-yellow-600 hover:text-yellow-700 hover:border-yellow-500 inline-block"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
