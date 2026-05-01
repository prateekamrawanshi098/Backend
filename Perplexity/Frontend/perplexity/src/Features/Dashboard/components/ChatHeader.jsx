const ChatHeader = ({ selectedChat }) => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-4 lg:px-6">
      <button
        className="rounded-lg px-3 py-2 text-lg font-semibold text-zinc-100 transition hover:bg-[#303030]"
        type="button"
      >
        Perplexity v
      </button>

      {selectedChat && (
        <button
          className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          type="button"
        >
          Share
        </button>
      )}
    </header>
  );
};

export default ChatHeader;
