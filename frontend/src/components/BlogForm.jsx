import { useEffect, useState } from 'react';

export default function BlogForm({ blog, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  // Load initial data for edit mode
  useEffect(() => {
    setTitle(blog?.title || '');
    setContent(blog?.content || '');
    setImage(null); // Clear previous file input
  }, [blog]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    if (image) fd.append('image', image);

    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded border p-4">
      <h3 className="text-lg font-semibold">
        {blog ? 'Edit Blog' : 'Create Blog'}
      </h3>

      {/* Blog Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      {/* Blog Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
        rows={5}
        className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      {/* Optional: Show existing image if editing and no new image selected */}
      {blog?.image && !image && (
        <img
          src={blog.image}
          alt="Current"
          className="h-32 w-full object-cover rounded border"
        />
      )}

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="block w-full text-sm text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-sky-100 file:px-2 file:py-1 file:text-sky-700"
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-white transition hover:bg-sky-700"
        >
          {blog ? 'Update' : 'Create'}
        </button>

        {blog && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
