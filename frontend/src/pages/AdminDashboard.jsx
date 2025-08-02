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

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    const [b, a, c] = await Promise.allSettled([
      fetchBlogs(), getAboutAdmin(), getContactAdmin(),
    ]);
    if (b.status === 'fulfilled') setBlogs(b.value.data);
    if (a.status === 'fulfilled') setAbout(a.value.data);
    if (c.status === 'fulfilled') setContact(c.value.data);
  };

  /* Handlers omitted for brevity – identical logic, just call loadAllData() after each operation */

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Navbar />
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {/* About Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-700">About Section</h2>
          {!editingAbout && about ? (
            <div className="space-y-3 rounded border bg-white p-4">
              <p className="text-slate-700">{about.description}</p>
              {about.imageUrl && (
                <img
                  src={`http://localhost:5000${about.imageUrl}`}
                  alt="About"
                  className="h-32 w-32 rounded object-cover"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingAbout(true)}
                  className="rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete About?')) {
                      deleteAbout().then(() => {
                        setAbout(null);
                        loadAllData();
                      });
                    }
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <AboutForm
              data={about}
              onSave={(fd) => (about ? updateAbout(fd) : createAbout(fd))
                .then(() => {
                  setEditingAbout(false);
                  loadAllData();
                })}
              onCancel={() => setEditingAbout(false)}
            />
          )}
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-700">Contact Section</h2>
          {!editingContact && contact ? (
            <div className="space-y-3 rounded border bg-white p-4">
              <p className="text-slate-700">{contact.description}</p>
              {contact.image && (
                <img
                  src={`http://localhost:5000${contact.image}`}
                  alt="Contact"
                  className="h-32 w-32 rounded object-cover"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingContact(true)}
                  className="rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete Contact?')) {
                      deleteContact().then(() => {
                        setContact(null);
                        loadAllData();
                      });
                    }
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <ContactForm
              data={contact}
              onSave={(fd) => (contact ? updateContact(fd) : createContact(fd))
                .then(() => {
                  setEditingContact(false);
                  loadAllData();
                })}
              onCancel={() => setEditingContact(false)}
            />
          )}
        </section>

        {/* Blogs Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-700">All Blogs</h2>
          <BlogForm
            blog={editingBlog}
            onSave={(fd) => (editingBlog ? updateBlog(editingBlog._id, fd) : createBlog(fd))
              .then(() => {
                setEditingBlog(null);
                loadAllData();
              })}
            onCancel={() => setEditingBlog(null)}
          />

          <ul className="mt-6 space-y-4">
            {blogs.map((b) => (
              <li
                key={b._id}
                className="flex items-center gap-4 rounded border bg-white p-3"
              >
                {b.image && (
                  <img
                    src={`http://localhost:5000${b.image}`}
                    alt={b.title}
                    className="h-20 w-20 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-slate-600">
                    {b.content.slice(0, 100)}
                    {b.content.length > 100 && '…'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBlog(b)}
                    className="rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this blog?')) {
                        deleteBlog(b._id).then(loadAllData);
                      }
                    }}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}