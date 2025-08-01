import { useEffect, useState } from 'react';
import { getAbout } from '../api';
import Navbar from '../components/Navbar';

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then((res) => setAbout(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: 'auto', padding: 16 }}>
        <h1>About Us</h1>

        {loading ? (
          <p>Loading...</p>
        ) : about ? (
          <>
            <p>{about.description}</p>
            {about.imageUrl && (
              <img
                src={`http://localhost:5000${about.imageUrl}`}
                alt="About"
                style={{ maxWidth: '100%', borderRadius: 8, marginTop: 16 }}
              />
            )}
          </>
        ) : (
          <p>No information available yet.</p>
        )}
      </div>
    </>
  );
}
