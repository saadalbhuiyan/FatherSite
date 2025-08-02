import { useEffect, useState } from 'react';
import { getContact } from '../api';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [contact, setContact] = useState(null); // Store contact info
  const [loading, setLoading] = useState(true); // Loading state flag

  useEffect(() => {
    // Fetch contact data on mount
    getContact()
      .then((res) => setContact(res.data))
      .catch(() => {
        // Optional: handle error (silent fail here)
      })
      .finally(() => setLoading(false)); // Loading finished
  }, []);

  return (
    <>
      <Navbar />

      {/* Main content container centered vertically and horizontally */}
      <main className="flex justify-center items-start min-h-[calc(100vh-4rem)] px-4 py-12">
        {loading ? (
          // Show loading message while fetching
          <p className="text-slate-300">Loading…</p>
        ) : contact ? (
          // Show contact card when data is available
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Contact image, fallback to default if none */}
            <img
              src={`http://localhost:5000${contact.image || '/default-contact.jpg'}`}
              alt="Contact"
              className="w-full h-auto object-cover"
            />

            {/* Contact description section */}
            <div className="p-5 sm:p-6">
              <h1 className="text-2xl font-bold text-sky-400 mb-3">Contact Us</h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {contact.description}
              </p>
            </div>
          </div>
        ) : (
          // Message when contact info is not available
          <p className="text-slate-400">Contact information coming soon.</p>
        )}
      </main>
    </>
  );
}
