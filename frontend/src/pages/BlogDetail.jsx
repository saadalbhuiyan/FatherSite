import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlog } from '../api';
import Navbar from '../components/Navbar';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog(id)
      .then((res) => setBlog(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: 'auto', padding: 16 }}>
        <Link to="/blogs">← Back to blogs</Link>

        {loading ? (
          <p>Loading…</p>
        ) : blog ? (
          <>
            <h1>{blog.title}</h1>

            {blog.image && (
              <img
                src={`http://localhost:5000${blog.image}`}
                alt={blog.title}
                style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 16 }}
              />
            )}

            <div
              style={{ lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <p style={{ marginTop: 20, fontSize: 14, color: '#888' }}>
              Posted on: {new Date(blog.createdAt).toLocaleString()}
            </p>
          </>
        ) : (
          <p>Blog not found.</p>
        )}
      </div>
    </>
  );
}
