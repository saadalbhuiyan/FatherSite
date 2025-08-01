import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../api';
import Navbar from '../components/Navbar';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs().then(res => setBlogs(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <h1>Blogs</h1>
      {blogs.length === 0 && <p>No blogs yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {blogs.map(b => (
          <li key={b._id} style={{ marginBottom: 20 }}>
            <Link to={`/blogs/${b._id}`}>
              <h3>{b.title}</h3>
            </Link>
            <p>{b.content.slice(0, 120)}…</p>
            {b.image && (
              <img
                src={`http://localhost:5000${b.image}`}
                alt={b.title}
                style={{ maxWidth: 200, height: 'auto' }}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}