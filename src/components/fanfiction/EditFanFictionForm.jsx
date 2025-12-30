import { useEffect, useState } from "react";
import api from "../../api";

const EditFanFictionForm = ({ fanfic, onUpdated }) => {
  const [form, setForm] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Load tags */
  useEffect(() => {
    api.get("/tags/")
      .then(res => setTags(res.data))
      .catch(() => {});
  }, []);

  /* Preload fanfic data */
  useEffect(() => {
    if (!fanfic) return;
    setForm({
      title: fanfic.title,
      summary: fanfic.summary,
      status: fanfic.status,
      front_page_url: fanfic.front_page_url || "",
      tag_ids: fanfic.tags.map(t => t.id),
    });
  }, [fanfic]);

  if (!form) return null;

  const toggleTag = (id) => {
    setForm(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(id)
        ? prev.tag_ids.filter(t => t !== id)
        : [...prev.tag_ids, id],
    }));
  };

    const handleSubmit = async () => {
    setLoading(true);
    try {
        const payload = {
        ...form,
        front_page_url:
            form.front_page_url?.trim() === ""
            ? null
            : form.front_page_url.trim(),
        };

        const res = await api.put(`/fanfiction/${fanfic.id}/`, payload);
        onUpdated(res.data);
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="bg-zinc-900 rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-orange-300">
        Edit Fanfiction
      </h2>

      {/* Title */}
      <input
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
      />

      {/* Summary */}
      <textarea
        value={form.summary}
        onChange={e => setForm({ ...form, summary: e.target.value })}
        rows={4}
        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
      />

      {/* Cover */}
      <input
        value={form.front_page_url}
        onChange={e => setForm({ ...form, front_page_url: e.target.value })}
        placeholder="Cover image URL"
        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
      />

      {/* Status (FIXED) */}
      <div className="flex gap-4">
        {["ongoing", "completed"].map(s => (
          <button
            key={s}
            onClick={() => setForm({ ...form, status: s })}
            className={`px-6 py-2 rounded-full ${
              form.status === s ? "bg-orange-500" : "bg-zinc-800"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tags (FIXED) */}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`px-3 py-1 rounded-full text-sm border ${
              form.tag_ids.includes(tag.id)
                ? "bg-orange-500 border-orange-400"
                : "border-zinc-700 text-zinc-400"
            }`}
          >
            #{tag.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-orange-500 px-8 py-3 rounded-full font-bold"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditFanFictionForm;
