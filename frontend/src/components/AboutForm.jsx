import { useEffect, useState } from 'react';

export default function AboutForm({ data, onSave, onCancel }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    setDescription(data?.description || '');
    setImage(null);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('description', description);
    if (image) fd.append('image', image);
    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h3>About Section</h3>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="About description"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" disabled={!description}>
        {data ? 'Update' : 'Create'}
      </button>
      {data && (
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
