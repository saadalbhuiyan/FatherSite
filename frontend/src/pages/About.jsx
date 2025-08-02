import { useEffect, useState } from 'react';
import { getAbout } from '../api';
import Navbar from '../components/Navbar';

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the About data on component mount
    getAbout()
      .then((res) => setAbout(res.data))
      .catch(() => {
        // Optional: handle errors here
        setAbout(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* Main container centered vertically and horizontally */}
      <main className="flex justify-center items-start min-h-[calc(100vh-4rem)] px-4 py-12">
        {loading ? (
          <p className="text-slate-300">Loading…</p>
        ) : about ? (
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            {/* About image */}
            {about.imageUrl && (
              <img
                src={`http://localhost:5000${about.imageUrl}`}
                alt="About"
                className="w-full h-auto object-cover"
              />
            )}

            {/* About description */}
            <div className="p-5 sm:p-6">
              <h1 className="text-2xl font-bold text-sky-400 mb-3">About Us</h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {about.description}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No information available yet.</p>
        )}
      </main>
    </>
  );
}
