import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlog } from '../api';
import Navbar from '../components/Navbar';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog(id).then(res => setBlog(res.data));
  }, [id]);

  if (!blog) return <p>Loading…</p>;

  return (
    <>
      <Navbar />
      <Link to="/blogs">← Back to blogs</Link>
      <h1>{blog.title}</h1>

      {blog.image && (
        <img
          src={`http://localhost:5000${blog.image}`}
          alt={blog.title}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <small>{new Date(blog.createdAt).toLocaleString()}</small>
    </>
  );
}