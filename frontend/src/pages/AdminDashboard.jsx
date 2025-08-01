import { useEffect, useState } from 'react';
import {
  fetchBlogs, createBlog, updateBlog, deleteBlog, logout,
  getAboutAdmin, createAbout, updateAbout, deleteAbout,
  getContactAdmin, createContact, updateContact, deleteContact
} from '../api';
import BlogForm from '../components/BlogForm';
import AboutForm from '../components/AboutForm';
import ContactForm from '../components/ContactForm';

export default function AdminDashboard() {
  /* ---------- blogs ---------- */
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);

  /* ---------- about ---------- */
  const [about, setAbout] = useState(null);

  /* ---------- contact ---------- */
  const [contact, setContact] = useState(null);

  /* ---------- loaders ---------- */
  const loadBlogs = async () => {
    const { data } = await fetchBlogs();
    setBlogs(data);
  };
  const loadAbout = async () => {
    try {
      const { data } = await getAboutAdmin();
      setAbout(data);
    } catch {}
  };
  const loadContact = async () => {
    try {
      const { data } = await getContactAdmin();
      setContact(data);
    } catch {}
  };

  useEffect(() => {
    loadBlogs();
    loadAbout();
    loadContact();
  }, []);

  /* ---------- CRUD handlers ---------- */
  const saveBlog = async (fd) => {
    editing ? await updateBlog(editing._id, fd) : await createBlog(fd);
    setEditing(null);
    loadBlogs();
  };
  const delBlog = async (id) => {
    await deleteBlog(id);
    loadBlogs();
  };

  const saveAbout = async (fd) => {
    about ? await updateAbout(fd) : await createAbout(fd);
    loadAbout();
  };
  const delAbout = async () => {
    await deleteAbout();
    setAbout(null);
  };

  const saveContact = async (fd) => {
    contact ? await updateContact(fd) : await createContact(fd);
    loadContact();
  };
  const delContact = async () => {
    await deleteContact();
    setContact(null);
  };

  return (
    <>
      <h1>Admin Dashboard</h1>
      <button onClick={() => { logout(); localStorage.removeItem('adminToken'); window.location.href = '/'; }}>
        Logout
      </button>

      {/* ---- About ---- */}
      <hr />
      <h2>About Section</h2>
      {about && (
        <>
          <p>{about.description}</p>
          {about.imageUrl && (
            <img src={`http://localhost:5000${about.imageUrl}`} alt="About" width={150} />
          )}
          <button onClick={delAbout}>Delete</button>
        </>
      )}
      <AboutForm data={about} onSave={saveAbout} />

      {/* ---- Contact ---- */}
      <hr />
      <h2>Contact Section</h2>
      {contact && (
        <>
          <p>{contact.description}</p>
          {contact.image && (
            <img src={`http://localhost:5000${contact.image}`} alt="Contact" width={150} />
          )}
          <button onClick={delContact}>Delete</button>
        </>
      )}
      <ContactForm data={contact} onSave={saveContact} />

      {/* ---- Blogs ---- */}
      {/* ---- Blogs ---- */}
<hr />
<h2>All Blogs</h2>

{/* Create / Edit form stays the same */}
<BlogForm
  blog={editing}
  onSave={saveBlog}
  onCancel={() => setEditing(null)}
/>

<ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
  {blogs.map((b) => (
    <li
      key={b._id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
        padding: 8,
        border: '1px solid #ddd',
        borderRadius: 4,
      }}
    >
      {/* thumbnail image */}
      {b.image && (
        <img
          src={`http://localhost:5000${b.image}`}
          alt={b.title}
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
        />
      )}

      {/* title + preview */}
      <div style={{ flex: 1 }}>
        <strong>{b.title}</strong>
        <p style={{ margin: 0, fontSize: 14, color: '#555' }}>
          {b.content.slice(0, 100)}
          {b.content.length > 100 && '…'}
        </p>
      </div>

      {/* actions */}
      <div>
        <button onClick={() => setEditing(b)}>Edit</button>
        <button onClick={() => delBlog(b._id)}>Delete</button>
      </div>
    </li>
  ))}
</ul>
    </>
  );
}