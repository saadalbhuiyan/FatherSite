import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../api';
import Navbar from '../components/Navbar';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: 'auto', padding: 16 }}>
        <h1>Blogs</h1>

        {loading ? (
          <p>Loading…</p>
        ) : blogs.length === 0 ? (
          <p>No blogs yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {blogs.map((b) => (
              <li
                key={b._id}
                style={{
                  marginBottom: 24,
                  padding: 12,
                  border: '1px solid #eee',
                  borderRadius: 6,
                }}
              >
                <Link to={`/blogs/${b._id}`}>
                  <h3>{b.title}</h3>
                </Link>

                <p style={{ margin: '8px 0', color: '#555' }}>
                  {b.content.slice(0, 120)}
                  {b.content.length > 120 && '…'}
                </p>

                {b.image && (
                  <img
                    src={`http://localhost:5000${b.image}`}
                    alt={b.title}
                    style={{ maxWidth: 200, borderRadius: 4 }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
