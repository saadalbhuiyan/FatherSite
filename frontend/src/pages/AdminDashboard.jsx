import { useEffect, useState } from 'react';
import {
  fetchBlogs, createBlog, updateBlog, deleteBlog, logout,
  getAboutAdmin, createAbout, updateAbout, deleteAbout,
  getContactAdmin, createContact, updateContact, deleteContact,
} from '../api';

import BlogForm from '../components/BlogForm';
import AboutForm from '../components/AboutForm';
import ContactForm from '../components/ContactForm';
import Navbar from '../components/Navbar';


export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [about, setAbout] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [blogsRes, aboutRes, contactRes] = await Promise.allSettled([
      fetchBlogs(),
      getAboutAdmin(),
      getContactAdmin(),
    ]);
    if (blogsRes.status === 'fulfilled') setBlogs(blogsRes.value.data);
    if (aboutRes.status === 'fulfilled') setAbout(aboutRes.value.data);
    if (contactRes.status === 'fulfilled') setContact(contactRes.value.data);
  };

  const handleSaveBlog = async (fd) => {
    editingBlog ? await updateBlog(editingBlog._id, fd) : await createBlog(fd);
    setEditingBlog(null);
    loadAllData();
  };

  const handleDeleteBlog = async (id) => {
    await deleteBlog(id);
    loadAllData();
  };

  const handleSaveAbout = async (fd) => {
    about ? await updateAbout(fd) : await createAbout(fd);
    loadAllData();
  };

  const handleDeleteAbout = async () => {
    await deleteAbout();
    setAbout(null);
  };

  const handleSaveContact = async (fd) => {
    contact ? await updateContact(fd) : await createContact(fd);
    loadAllData();
  };

  const handleDeleteContact = async () => {
    await deleteContact();
    setContact(null);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (

    <div style={{ padding: 20 }}>
            <Navbar />
      
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* About Section */}
      <hr />
      <h2>About Section</h2>
      {about && (
        <div>
          <p>{about.description}</p>
          {about.imageUrl && (
            <img
              src={`http://localhost:5000${about.imageUrl}`}
              alt="About"
              width={150}
            />
          )}
          <button onClick={handleDeleteAbout}>Delete</button>
        </div>
      )}
      <AboutForm data={about} onSave={handleSaveAbout} />

      {/* Contact Section */}
      <hr />
      <h2>Contact Section</h2>
      {contact && (
        <div>
          <p>{contact.description}</p>
          {contact.image && (
            <img
              src={`http://localhost:5000${contact.image}`}
              alt="Contact"
              width={150}
            />
          )}
          <button onClick={handleDeleteContact}>Delete</button>
        </div>
      )}
      <ContactForm data={contact} onSave={handleSaveContact} />

      {/* Blogs Section */}
      <hr />
      <h2>All Blogs</h2>
      <BlogForm
        blog={editingBlog}
        onSave={handleSaveBlog}
        onCancel={() => setEditingBlog(null)}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
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
            {b.image && (
              <img
                src={`http://localhost:5000${b.image}`}
                alt={b.title}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <strong>{b.title}</strong>
              <p style={{ margin: 0, fontSize: 14, color: '#555' }}>
                {b.content.slice(0, 100)}
                {b.content.length > 100 && '…'}
              </p>
            </div>
            <div>
              <button onClick={() => setEditingBlog(b)}>Edit</button>
              <button onClick={() => handleDeleteBlog(b._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
