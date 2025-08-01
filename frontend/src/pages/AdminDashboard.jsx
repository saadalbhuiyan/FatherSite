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
  const [editingAbout, setEditingAbout] = useState(false);

  const [contact, setContact] = useState(null);
  const [editingContact, setEditingContact] = useState(false);

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

  // Blog handlers
  const handleSaveBlog = async (fd) => {
    if (editingBlog) await updateBlog(editingBlog._id, fd);
    else await createBlog(fd);
    setEditingBlog(null);
    loadAllData();
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
      loadAllData();
    }
  };

  // About handlers
  const handleSaveAbout = async (fd) => {
    if (about) await updateAbout(fd);
    else await createAbout(fd);
    setEditingAbout(false);
    loadAllData();
  };

  const handleDeleteAbout = async () => {
    if (window.confirm('Are you sure you want to delete About information?')) {
      await deleteAbout();
      setAbout(null);
      setEditingAbout(false);
    }
  };

  // Contact handlers
  const handleSaveContact = async (fd) => {
    if (contact) await updateContact(fd);
    else await createContact(fd);
    setEditingContact(false);
    loadAllData();
  };

  const handleDeleteContact = async () => {
    if (window.confirm('Are you sure you want to delete Contact information?')) {
      await deleteContact();
      setContact(null);
      setEditingContact(false);
    }
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
      {!editingAbout && about && (
        <div>
          <p>{about.description}</p>
          {about.imageUrl && (
            <img
              src={`http://localhost:5000${about.imageUrl}`}
              alt="About"
              width={150}
            />
          )}
          <button onClick={() => setEditingAbout(true)}>Edit</button>
          <button
            onClick={handleDeleteAbout}
            style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
          >
            Delete
          </button>
        </div>
      )}
      {(editingAbout || !about) && (
        <AboutForm
          data={about}
          onSave={handleSaveAbout}
          onCancel={() => setEditingAbout(false)}
        />
      )}

      {/* Contact Section */}
      <hr />
      <h2>Contact Section</h2>
      {!editingContact && contact && (
        <div>
          <p>{contact.description}</p>
          {contact.image && (
            <img
              src={`http://localhost:5000${contact.image}`}
              alt="Contact"
              width={150}
            />
          )}
          <button onClick={() => setEditingContact(true)}>Edit</button>
          <button
            onClick={handleDeleteContact}
            style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
          >
            Delete
          </button>
        </div>
      )}
      {(editingContact || !contact) && (
        <ContactForm
          data={contact}
          onSave={handleSaveContact}
          onCancel={() => setEditingContact(false)}
        />
      )}

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
              <button
                onClick={() => handleDeleteBlog(b._id)}
                style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
