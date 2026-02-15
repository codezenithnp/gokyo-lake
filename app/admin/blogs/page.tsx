"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  author: string;
  createdAt: string;
};

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blogs");
      if (!res.ok) { setError("Failed to load blogs."); return; }
      const data = await res.json();
      setBlogs(data.blogs ?? []);
    } catch {
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeletingId(id);
    setError(""); setMessage("");
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete."); return; }
      setMessage("Blog deleted.");
      fetchBlogs();
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    const newStatus = blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) { setError("Status update failed."); return; }
      setMessage(`Blog ${newStatus === "PUBLISHED" ? "published" : "unpublished"}.`);
      fetchBlogs();
    } catch {
      setError("Status update failed.");
    }
  };

  const filtered = filterStatus === "all"
    ? blogs
    : blogs.filter((b) => b.status === filterStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => router.push("/admin/blogs/new")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + New Post
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-red-700 text-sm">{error}</div>}
      {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-green-700 text-sm">{message}</div>}

      {/* Filter */}
      <div className="flex items-center gap-2 mb-5">
        {["all", "PUBLISHED", "DRAFT"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              filterStatus === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "all" ? "All" : s === "PUBLISHED" ? "Published" : "Drafts"}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} post{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-400 text-sm py-12 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400 text-sm py-12 text-center bg-white rounded-xl border border-gray-200">
          No blog posts found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Author</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Created</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{blog.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/{blog.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{blog.author}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(blog)}
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition ${
                        blog.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {blog.status === "PUBLISHED" ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/blogs/${blog._id}/edit`)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium hover:underline disabled:opacity-50"
                      >
                        {deletingId === blog._id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
