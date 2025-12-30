import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateFanFictionForm from "../components/fanfiction/CreateFanFictionForm";
const FanFictionMetaCreatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fanfic, setFanfic] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    // later: fetch fanfiction detail
    // setFanfic(res.data)
    setLoading(false);
  }, [id]);

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
            {id ? "Edit Fanfiction" : "Create New Fanfiction"}
          </h1>
        </div>

        <CreateFanFictionForm
          fanfic={fanfic}
          setFanfic={setFanfic}
          onSuccess={(createdFanfic) => {
            navigate(`/fanfiction/${createdFanfic.id}/chapters`);
          }}
        />

      </div>
    </div>
  );
};

export default FanFictionMetaCreatePage;
