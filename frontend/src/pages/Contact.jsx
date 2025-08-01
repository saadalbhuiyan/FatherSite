import { useEffect, useState } from 'react';
import { getContact } from '../api';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContact()
      .then((res) => setContact(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: 'auto', padding: 16 }}>
        <h1>Contact Us</h1>

        {loading ? (
          <p>Loading...</p>
        ) : contact ? (
          <>
            <p>{contact.description}</p>
            {contact.image && (
              <img
                src={`http://localhost:5000${contact.image}`}
                alt="Contact"
                style={{ maxWidth: '100%', borderRadius: 8, marginTop: 16 }}
              />
            )}
          </>
        ) : (
          <p>Contact information coming soon.</p>
        )}
      </div>
    </>
  );
}
