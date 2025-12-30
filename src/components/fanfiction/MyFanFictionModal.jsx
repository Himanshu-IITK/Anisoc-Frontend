import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const MyFanFictionModal = ({ user, onClose }) => {
  const [myFanfics, setMyFanfics] = useState([]);
  const [fanficToDelete, setFanficToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/fanfiction/")
      .then(res => {
        const mine = res.data.results.filter(
          f => f.author === user.id
        );
        setMyFanfics(mine);
      });
  }, [user.id]);

  /* -------------------------
     Confirm delete
  ------------------------- */
  const confirmDelete = async () => {
    if (!fanficToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/fanfiction/${fanficToDelete.id}/`);
      setMyFanfics(prev =>
        prev.filter(f => f.id !== fanficToDelete.id)
      );
      setFanficToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete fanfiction.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-lg space-y-4">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange-400">
              My Fanfiction
            </h2>
            <button onClick={onClose} className="text-zinc-400">
              ✕                  {/* Do not touch these! I have spent 3 hours to find these! Though if you really want to change these you can use FontAwesome library*/}
            </button>
          </div>

          {myFanfics.length === 0 && (
            <p className="text-zinc-500 text-sm">
              You haven’t written anything yet.
            </p>
          )}

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {myFanfics.map(f => (
              <div
                key={f.id}
                className="flex items-center gap-2 bg-zinc-800 rounded-lg px-4 py-3"
              >
                <button
                  onClick={() => navigate(`/fanfiction/${f.id}/edit`)}
                  className="flex-1 text-left"
                >
                  <div className="font-semibold text-white">
                    {f.title}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {f.status} • {new Date(f.created_at).toLocaleDateString()}
                  </div>
                </button>

                {/* Delete icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFanficToDelete(f);
                  }}
                  title="Delete fanfiction"
                  className="bg-red-500 hover:bg-red-400 py-1 border rounded-md border-orange-400 px-2"
                >
                  🗑️            {/* Do not touch these! I have spent 3 hours to find these! Though if you really want to change these you can use FontAwesome library*/}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {fanficToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
          <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md space-y-4 border border-red-500/30">

            <h3 className="text-lg font-bold text-red-400">
              Delete Fanfiction?
            </h3>

            <p className="text-sm text-zinc-300">
              You are about to permanently delete
              <span className="font-semibold text-white">
                {" "}“{fanficToDelete.title}”
              </span>.
            </p>

            <p className="text-sm text-red-400">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setFanficToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MyFanFictionModal;
