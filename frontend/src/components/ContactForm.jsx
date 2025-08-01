import { useEffect, useState } from 'react';

export default function ContactForm({ data, onSave }) {
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => { if (data) setDesc(data.description); }, [data]);

  const handle = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('description', desc);
    if (image) fd.append('image', image);
    onSave(fd);
  };

  return (
    <form onSubmit={handle} style={{ maxWidth: 600 }}>
      <h3>Manage Contact</h3>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Contact description"
        required
      />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button>{data ? 'Update' : 'Create'}</button>
    </form>
  );
}