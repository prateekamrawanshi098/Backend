const ChatComposer = ({
  draft,
  isCentered = false,
  isSending,
  onDraftChange,
  onSubmit,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className={`rounded-[28px] bg-[#303030] p-3 shadow-xl shadow-black/20 ${
        isCentered ? "mt-8" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <textarea
        className="max-h-48 min-h-12 w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-white outline-none placeholder:text-zinc-500"
        disabled={isSending}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything"
        rows={1}
        value={draft}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 text-xl leading-none text-zinc-200 transition hover:bg-zinc-700"
            title="Attach"
            type="button"
          >
            +
          </button>
          <button
            className="rounded-full border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700"
            type="button"
          >
            Perplexity v
          </button>
        </div>

        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-base font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-400"
          disabled={isSending || !draft.trim()}
          title="Send"
          type="submit"
        >
          {isSending ? "..." : "^"}
        </button>
      </div>
    </form>
  );
};

export default ChatComposer;
