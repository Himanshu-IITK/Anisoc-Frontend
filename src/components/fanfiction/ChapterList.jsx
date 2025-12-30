const ChapterList = ({ chapters, selectedId, onSelect }) => {
  return (
    <div className="bg-zinc-800/40 rounded-xl p-4 h-full">
      <h3 className="text-zinc-300 font-semibold mb-3">
        Chapters
      </h3>

      {chapters.length === 0 ? (
        <div className="text-zinc-500 text-sm">
          No chapters yet.  
          <br />
          Start writing your first chapter →
        </div>
      ) : (
        <div className="space-y-2">
          {chapters.map(chapter => {
            const isSelected = chapter.id === selectedId;

            return (
              <button
                key={chapter.id}
                onClick={() => onSelect(chapter)}
                className={`w-full text-left px-3 py-2 rounded-lg transition
                  ${
                    isSelected
                      ? "bg-orange-500/20 border border-orange-400"
                      : "bg-zinc-900 hover:bg-zinc-700"
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">
                    Ch {chapter.chapter_number}
                  </span>

                  <span className="text-xs text-zinc-400">
                    {chapter.published_at ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="text-sm text-zinc-400 truncate">
                  {chapter.title || "Untitled chapter"}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChapterList;
