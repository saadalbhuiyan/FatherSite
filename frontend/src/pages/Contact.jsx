import { useEffect, useState } from 'react';
import { getContact } from '../api';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    getContact().then(res => setContact(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <h1>Contact Us</h1>
      {contact ? (
        <>
          <p>{contact.description}</p>
          {contact.image && (
            <img
              src={`http://localhost:5000${contact.image}`}
              alt="Contact"
              style={{ maxWidth: '100%' }}
            />
          )}
        </>
      ) : (
        <p>Contact information coming soon.</p>
      )}
    </>
  );
}