import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../api';
import Navbar from '../components/Navbar';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]); // State to hold list of blogs
  const [loading, setLoading] = useState(true); // Loading state indicator

  useEffect(() => {
    // Fetch all blogs when component mounts
    fetchBlogs()
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([])) // Reset to empty on error
      .finally(() => setLoading(false)); // Stop loading in all cases
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Conditionally render based on loading and blogs availability */}
        {loading ? (
          <p className="text-slate-300">Loading…</p>
        ) : blogs.length === 0 ? (
          <p className="text-slate-400">No blogs yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Render each blog as a clickable card */}
            {blogs.map((b) => (
              <Link
                key={b._id}
                to={`/blogs/${b._id}`}
                className="group block bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400 transition"
              >
                {/* Optional blog image */}
                {b.image && (
                  <img
                    src={`http://localhost:5000${b.image}`}
                    alt={b.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  {/* Blog title */}
                  <h3 className="text-xl font-semibold text-sky-400 group-hover:text-sky-300">
                    {b.title}
                  </h3>

                  {/* Short preview of blog content */}
                  <p className="mt-2 text-sm text-slate-300 line-clamp-3">
                    {b.content.slice(0, 120)}
                    {b.content.length > 120 && '…'}
                  </p>

                  {/* Call to action */}
                  <span className="mt-3 inline-block text-sm font-medium text-sky-500 group-hover:text-sky-400">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
