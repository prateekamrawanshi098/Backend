const DashboardSidebar = ({
  chatSearch,
  chats,
  displayName,
  isLoadingChats,
  onChatSearchChange,
  onNewChat,
  onSelectChat,
  selectedChatId,
  visibleChats,
}) => {
  return (
    <aside className="flex min-h-0 flex-col bg-[#171717] p-3">
      <div className="flex h-12 items-center justify-between px-2">
        <p className="text-sm font-semibold text-zinc-100">Perplexity</p>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-zinc-300 transition hover:bg-zinc-800"
          onClick={onNewChat}
          title="New chat"
          type="button"
        >
          +
        </button>
      </div>

      <button
        className={`mt-2 flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-500 ${
          !selectedChatId
            ? "bg-[#303030] text-white"
            : "text-zinc-200 hover:bg-zinc-800"
        }`}
        onClick={onNewChat}
        type="button"
      >
        <span className="text-lg leading-none">+</span>
        New chat
      </button>

      <input
        className="mt-2 h-10 rounded-lg bg-[#212121] px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-600"
        onChange={(event) => onChatSearchChange(event.target.value)}
        placeholder="Search chats"
        value={chatSearch}
      />

      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <p className="px-3 pb-2 text-xs font-medium text-zinc-500">Chats</p>

        {isLoadingChats && (
          <p className="rounded-lg px-3 py-2 text-sm text-zinc-500">
            Loading chats...
          </p>
        )}

        {!isLoadingChats && chats.length === 0 && (
          <p className="rounded-lg px-3 py-2 text-sm text-zinc-500">
            No saved chats yet.
          </p>
        )}

        <nav className="flex flex-col gap-1">
          {visibleChats.map((chat) => (
            <button
              className={`h-10 rounded-lg px-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-500 ${
                selectedChatId === chat._id
                  ? "bg-[#303030] text-white"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              title={chat.title}
              type="button"
            >
              <span className="block truncate">{chat.title}</span>
            </button>
          ))}

          {!isLoadingChats &&
            chats.length > 0 &&
            visibleChats.length === 0 && (
              <p className="rounded-lg px-3 py-2 text-sm text-zinc-500">
                No chats found.
              </p>
            )}
        </nav>
      </div>

      <div className="mt-3 border-t border-zinc-800 px-2 pt-3">
        <p className="truncate text-sm font-medium text-zinc-200">
          {displayName}
        </p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
