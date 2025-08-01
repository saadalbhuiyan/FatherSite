import { useEffect, useState } from 'react';

export default function BlogForm({ blog, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    } else {
      setTitle('');
      setContent('');
      setImage(null);
    }
  }, [blog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    if (image) fd.append('image', image);
    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h3>{blog ? 'Edit' : 'Create'} Blog</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">{blog ? 'Update' : 'Create'}</button>
      {blog && (
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
