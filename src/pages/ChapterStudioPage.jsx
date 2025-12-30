import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import ChapterStudio from "../components/fanfiction/ChapterStudio";

const ChapterStudioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fanfic, setFanfic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------------
     Fetch fanfiction detail
  ------------------------- */
  useEffect(() => {
    const fetchFanfic = async () => {
      try {
        const res = await api.get(`/fanfiction/${id}/`);
        setFanfic(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load fanfiction.");
      } finally {
        setLoading(false);
      }
    };

    fetchFanfic();
  }, [id]);

  /* -------------------------
     States
  ------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading fanfiction…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-xl space-y-4 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => navigate("/fanfiction")}
            className="text-orange-400 underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------
     Render
  ------------------------- */
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 mt-20">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/fanfiction/${id}/edit`)}
            className="text-orange-400 hover:text-orange-300"
          >
            ← Story details
          </button>

          <h1 className="text-2xl font-bold text-orange-400">
            {fanfic.title}
          </h1>
        </div>

        <ChapterStudio fanfic={fanfic} />

      </div>
    </div>
  );
};

export default ChapterStudioPage;
