"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isCloudinaryUrl } from "@/lib/image";

export default function NewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    author: "Admin",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.error ?? "Upload failed.");
        return;
      }
      const d = await res.json();
      if (d?.url) setForm((prev) => ({ ...prev, coverImage: d.url }));
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.content.trim()) { setError("Content is required."); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          excerpt: form.excerpt.trim(),
          content: form.content,
          coverImage: form.coverImage.trim(),
          status: form.status,
          author: form.author.trim() || "Admin",
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.error ? JSON.stringify(d.error) : "Failed to create blog.");
        return;
      }
      router.push("/admin/blogs");
    } catch {
      setError("Failed to create blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new blog article</p>
        </div>
        <button onClick={() => router.push("/admin/blogs")} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Blogs
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter blog title"
              />
            </div>

            {/* Author & Status row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition">
                  {isUploading ? "Uploading…" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                </label>
                <span className="text-xs text-gray-400">or paste URL below</span>
              </div>
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
              {form.coverImage && (
                <div className="mt-3 relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" unoptimized={isCloudinaryUrl(form.coverImage)} />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder="A short summary of the blog post (shown in listings)"
              />
            </div>

            {/* Content (Rich Text) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
              <p className="text-xs text-gray-400 mb-2">Supports HTML formatting. Use headings, paragraphs, lists, bold, italic, links, etc.</p>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={16}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder="<h2>Introduction</h2>\n<p>Write your blog content here...</p>"
              />
            </div>
          </div>

          {/* Submit bar */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Saving…" : "Create Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
