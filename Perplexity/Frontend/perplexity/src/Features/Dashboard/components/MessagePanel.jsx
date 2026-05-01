const MessagePanel = ({
  emptyComposer,
  error,
  hasMessages,
  isLoadingMessages,
  messages,
  messagesPanelRef,
}) => {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto" ref={messagesPanelRef}>
      <div
        className={`mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 ${
          hasMessages ? "pb-32 pt-6" : "py-8"
        }`}
      >
        {isLoadingMessages && (
          <p className="text-sm text-zinc-400">Loading messages...</p>
        )}

        {!isLoadingMessages && !hasMessages && (
          <div className="flex flex-1 flex-col justify-center pb-16">
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
                What can I help with?
              </h2>
            </div>
            {emptyComposer}
            {error && (
              <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                {error}
              </p>
            )}
          </div>
        )}

        {!isLoadingMessages && hasMessages && (
          <div className="space-y-7">
            {messages.map((item) => {
              const isUserMessage = item.role === "user";

              return (
                <article
                  className={`flex ${
                    isUserMessage ? "justify-end" : "justify-start"
                  }`}
                  key={item._id}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words text-[15px] leading-7 ${
                      isUserMessage
                        ? "rounded-3xl bg-[#303030] px-5 py-3 text-zinc-100"
                        : "text-zinc-100"
                    }`}
                  >
                    {item.content}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;
