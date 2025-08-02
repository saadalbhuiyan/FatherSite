import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlog } from '../api';
import Navbar from '../components/Navbar';

export default function BlogDetail() {
  const { id } = useParams(); // Get blog ID from route params
  const [blog, setBlog] = useState(null); // Store fetched blog data
  const [loading, setLoading] = useState(true); // Loading state indicator

  useEffect(() => {
    // Fetch blog data on component mount or when `id` changes
    fetchBlog(id)
      .then((res) => setBlog(res.data))
      .catch(() => setBlog(null)) // Handle fetch error by setting blog to null
      .finally(() => setLoading(false));
  }, [id]);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-slate-300">Loading…</p>
        </main>
      </>
    );
  }

  // Show message if blog data not found
  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-400">Blog not found.</p>
        </main>
      </>
    );
  }

  // Render blog details when data is available
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation link back to blog list */}
        <Link
          to="/blogs"
          className="inline-flex items-center text-sm font-medium text-black-800 hover:text-sky-300 mb-4"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to blogs
        </Link>

        <article>
          {/* Blog title */}
          <h1 className="text-4xl font-extrabold text-black-100 mb-4">
            {blog.title}
          </h1>

          {/* Blog image, if exists */}
          {blog.image && (
            <img
              src={`http://localhost:5000${blog.image}`}
              alt={blog.title}
              className="w-full h-auto rounded-xl mb-6"
            />
          )}

          {/* Blog content rendered as HTML safely */}
          <div
            className="prose prose-invert prose-slate max-w-none text-black-300"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Blog creation date */}
          <p className="mt-8 text-sm text-slate-500">
            Posted on {new Date(blog.createdAt).toLocaleString()}
          </p>
        </article>
      </main>
    </>
  );
}
