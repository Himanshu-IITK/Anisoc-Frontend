const ChapterListStudio = ({ chapters, selectedId, onSelect, onDelete }) => {
  if (chapters.length === 0) {
    return (
      <div className="text-zinc-500 text-sm">
        No chapters yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-zinc-300 font-semibold mb-2">
        Chapters
      </h3>

      {chapters.map(chapter => (
        <div
          key={chapter.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
            ${selectedId === chapter.id
              ? "bg-zinc-700"
              : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
          <button
            onClick={() => onSelect(chapter)}
            className="flex-1 text-left"
          >
            <span>
              Ch {chapter.chapter_number}: {chapter.title}
            </span>
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chapter);
            }}
            title="Delete chapter"
            className="bg-red-500 hover:bg-red-400 py-1 border rounded-md border-orange-400 px-2"
          >
            🗑️                   {/* Do not touch these! I have spent 3 hours to find these! Though if you really want to change these you can use FontAwesome library*/}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChapterListStudio;
