import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import EditFanFictionForm from "../components/fanfiction/EditFanFictionForm";

const FanFictionMetaEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fanfic, setFanfic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------------
     Fetch fanfiction meta
  ------------------------- */
  useEffect(() => {
    if (!id) return;

    api.get(`/fanfiction/${id}/`)
      .then(res => {
        setFanfic(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("You are not allowed to edit this fanfiction.");
        setLoading(false);
      });
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
        <div className="bg-zinc-900 p-6 rounded-xl text-center space-y-4">
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
     Render edit form
  ------------------------- */
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 mt-20">
      <div className="max-w-4xl mx-auto space-y-10">

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/fanfiction")}
            className="text-orange-400 hover:text-orange-300"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-orange-400">
            Edit Fanfiction
          </h1>
        </div>

        <EditFanFictionForm
          fanfic={fanfic}
          onUpdated={(updatedFanfic) => {
            setFanfic(updatedFanfic);
            navigate(`/fanfiction/${updatedFanfic.id}/chapters`);
          }}
        />

      </div>
    </div>
  );
};

export default FanFictionMetaEditPage;
