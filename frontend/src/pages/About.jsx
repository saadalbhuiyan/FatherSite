import { useEffect, useState } from 'react';
import { getAbout } from '../api';
import Navbar from '../components/Navbar';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    getAbout().then(res => setAbout(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <h1>About Us</h1>
      {about ? (
        <>
          <p>{about.description}</p>
          {about.imageUrl && (
            <img
              src={`http://localhost:5000${about.imageUrl}`}
              alt="About"
              style={{ maxWidth: '100%' }}
            />
          )}
        </>
      ) : (
        <p>Information coming soon.</p>
      )}
    </>
  );
}