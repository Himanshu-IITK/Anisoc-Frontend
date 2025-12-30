import { useEffect, useState } from "react";
import api from "../api";
import FanFictionCard from "../components/fanfiction/FanFictionCard";
import FanFictionSearch from "../components/fanfiction/FanFictionSearch";
import LoadMoreButton from "../components/common/LoadMoreButton";
import { useNavigate } from "react-router-dom";
import MyFanFictionModal from "../components/fanfiction/MyFanFictionModal";

const FanFictionList = () => {
  const [fanfics, setFanfics] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW
  const [user, setUser] = useState(null);
  const [showMine, setShowMine] = useState(false);

  const navigate = useNavigate();

  /* -------------------------
     Fetch current user (safe)
  ------------------------- */
  useEffect(() => {
    api.get("/auth/me/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const fetchFanFics = async (url = "/fanfiction/", replace = false) => {
    setLoading(true);

    const res = await api.get(url, {
      params: url === "/fanfiction/" && search
        ? { search }
        : {},
    });

    setFanfics(
      replace
        ? res.data.results
        : prev => [...prev, ...res.data.results]
    );

    setNextUrl(res.data.next);
    setLoading(false);
  };


  useEffect(() => {
    const t = setTimeout(() => {
      setFanfics([]);
      fetchFanFics("/fanfiction/", true);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="min-h-screen px-6 py-20 mt-4 text-white">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-orange-400 mb-6">
            Fanfiction
          </h1>

          <div className="flex gap-4">
            {user && (
              <button
                onClick={() => setShowMine(true)}
                className="px-6 py-2 mb-4 border border-orange-400/40 rounded-full text-orange-300 hover:bg-orange-500/10 transition"
              >
                My Fanfiction
              </button>
            )}

              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    navigate("/fanfiction/new");
                  }
                }}
                className="px-10 py-2 mb-4 bg-linear-to-r from-orange-500 to-red-600 rounded-full text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-orange-600/30"
              >
                Upload
              </button>

          </div>
        </div>

        <FanFictionSearch value={search} onChange={setSearch} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {fanfics.map(fanfic => (
            <FanFictionCard key={fanfic.id} fanfic={fanfic} />
          ))}
        </div>

        {nextUrl && (
          <LoadMoreButton
            onClick={() => fetchFanFics(nextUrl, false)}
            loading={loading}
          />
        )}

        {/* NEW: My Fanfiction Modal */}
        {showMine && user && (
          <MyFanFictionModal
            user={user}
            onClose={() => setShowMine(false)}
          />
        )}

      </div>
    </div>
  );
};

export default FanFictionList;
