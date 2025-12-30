import { useEffect, useState } from "react";
import api from "../../api";

const CreateFanFictionForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    status: "ongoing",
    front_page_url: "",
    tag_ids: [],
  });

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/tags/")
      .then(res => setTags(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value||null }));
  };

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
      const res = await api.post("/fanfiction/", form);
      onSuccess(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-orange-300">
        Create Fanfiction
      </h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Fanfiction title"
        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
      />

      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        rows={4}
        placeholder="Summary"
        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
      />

      <input
        name="front_page_url"
        value={form.front_page_url}
        onChange={handleChange}
        placeholder="Cover image URL (optional)"
        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
      />

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
        Create Story
      </button>
    </div>
  );
};

export default CreateFanFictionForm;
