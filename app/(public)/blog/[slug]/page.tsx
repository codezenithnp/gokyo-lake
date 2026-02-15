"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, use } from "react";
import { isCloudinaryUrl } from "@/lib/image";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  createdAt: string;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/public/blogs?slug=${encodeURIComponent(slug)}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        if (!data.blog) { setNotFound(true); return; }
        setPost(data.blog);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen pt-24">
        <div className="container mx-auto px-6 py-20 text-center text-gray-400">Loading…</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-gray-100 min-h-screen pt-24">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-blue-600 hover:underline font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-24">
      <article className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8">
          ← Back to Blog
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={isCloudinaryUrl(post.coverImage)}
            />
          </div>
        )}

        {/* Title & meta */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-8 gap-3">
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {post.author && (
            <>
              <span className="text-gray-300">·</span>
              <span>{post.author}</span>
            </>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-800
            prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
