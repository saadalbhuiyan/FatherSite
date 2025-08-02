import { useEffect, useState } from 'react';

export default function ContactForm({ data, onSave, onCancel }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // Load initial data when editing existing contact info
  useEffect(() => {
    setDescription(data?.description || '');
    setImage(null); // Reset image input when data changes
  }, [data]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('description', description);
    if (image) fd.append('image', image);

    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded border p-4">
      <h3 className="text-lg font-semibold">Manage Contact</h3>

      {/* Description textarea */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Contact description"
        required
        rows={4}
        className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      {/* Optional: Show existing image if editing and no new image selected */}
      {data?.imageUrl && !image && (
        <img
          src={data.imageUrl}
          alt="Current Contact"
          className="mb-2 h-24 w-full rounded object-cover border"
        />
      )}

      {/* Image upload input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="block w-full text-sm text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-sky-100 file:px-2 file:py-1 file:text-sky-700"
      />

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!description}
          className="rounded bg-sky-600 px-4 py-2 text-white transition hover:bg-sky-700 disabled:opacity-50"
        >
          {data ? 'Update' : 'Create'}
        </button>

        {data && (
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
