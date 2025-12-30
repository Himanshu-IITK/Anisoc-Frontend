import { useEffect, useState, useRef } from "react";
import api from "../../api";
import DraftBanner from "./DraftBanner";
import ChapterListStudio from "./ChapterListStudio";

const ChapterStudio = ({ fanfic }) => {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recoveredDraft, setRecoveredDraft] = useState(false);

  const editorRef = useRef(null);

  /* -------------------------
     Fetch chapters
  ------------------------- */
  const fetchChapters = async () => {
    const res = await api.get(`/fanfiction/${fanfic.id}/chapters/`);
    const list = res.data || [];
    list.sort((a, b) => a.chapter_number - b.chapter_number);
    setChapters(list);
  };

  useEffect(() => {
    fetchChapters();
  }, [fanfic.id]);

  const isEditing = Boolean(currentChapter);

  const nextChapterNumber =
    chapters.length === 0
      ? 1
      : chapters[chapters.length - 1].chapter_number + 1;

  /* -------------------------
     Draft key
  ------------------------- */
  const draftKey = isEditing
    ? `draft_chapter_${currentChapter.id}`
    : `draft_new_chapter_${fanfic.id}`;

  /* -------------------------
     Load draft
  ------------------------- */
  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      const d = JSON.parse(draft);
      setTitle(d.title || "");
      setContent(d.content || "");
      setRecoveredDraft(true);
    } else {
      setRecoveredDraft(false);
    }
  }, [draftKey]);

  /* -------------------------
     Autosave draft
  ------------------------- */
  useEffect(() => {
    if (!title && !content) return;
    const t = setTimeout(() => {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ title, content })
      );
    }, 1200);
    return () => clearTimeout(t);
  }, [title, content, draftKey]);

  /* -------------------------
     Sync editor (plain text)
  ------------------------- */
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== content) {
      editorRef.current.innerText = content || "";
    }
  }, [content]);

  /* -------------------------
     Publish / Update
  ------------------------- */
  const publish = async () => {
    const payload = { title, content };

    if (isEditing) {
      await api.put(`/chapters/${currentChapter.id}/`, payload);
    } else {
      await api.post(`/fanfiction/${fanfic.id}/chapters/`, payload);
    }

    localStorage.removeItem(draftKey);
    setRecoveredDraft(false);
    setTitle("");
    setContent("");
    setCurrentChapter(null);

    await fetchChapters();
  };

  /* -------------------------
     Confirm delete
  ------------------------- */
  const confirmDelete = async () => {
    if (!chapterToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/chapters/${chapterToDelete.id}/`);

      if (currentChapter?.id === chapterToDelete.id) {
        setCurrentChapter(null);
        setTitle("");
        setContent("");
      }

      setChapterToDelete(null);
      await fetchChapters();
    } catch (err) {
      console.error(err);
      alert("Failed to delete chapter");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-2xl p-8 shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold text-orange-300">
          Chapter Studio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <ChapterListStudio
            chapters={chapters}
            selectedId={currentChapter?.id}
            onSelect={(chapter) => {
              setCurrentChapter(chapter);
              setTitle(chapter.title || "");
              setContent(chapter.content || "");
            }}
            onDelete={setChapterToDelete}
          />

          <div className="md:col-span-3 space-y-4">

            {recoveredDraft && <DraftBanner />}

            <div className="text-sm text-zinc-400">
              {isEditing
                ? `Editing Chapter ${currentChapter.chapter_number}`
                : `New Chapter ${nextChapterNumber}`}
            </div>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Chapter title"
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
            />

            <div
              ref={editorRef}
              contentEditable
              spellCheck={false}
              className="w-full min-h-75 bg-black border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none"
              style={{
                unicodeBidi: "plaintext",
                whiteSpace: "pre-wrap",
              }}
              onInput={() => {
                setContent(editorRef.current.innerText);
              }}
            />

            <button
              onClick={publish}
              className="bg-orange-500 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              {isEditing ? "Update Chapter" : "Publish Chapter"}
            </button>

          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {chapterToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md space-y-4 border border-red-500/30">

            <h3 className="text-lg font-bold text-red-400">
              Delete Chapter?
            </h3>

            <p className="text-sm text-zinc-300">
              You are about to permanently delete
              <span className="font-semibold text-white">
                {" "}Chapter {chapterToDelete.chapter_number}
              </span>.
            </p>

            <p className="text-sm text-red-400">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setChapterToDelete(null)}
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

export default ChapterStudio;
