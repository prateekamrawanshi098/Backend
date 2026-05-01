import ChatComposer from "../components/ChatComposer";
import ChatHeader from "../components/ChatHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import MessagePanel from "../components/MessagePanel";
import { useDashboardChat } from "../hooks/useDashboardChat";

const Dashboard = () => {
  const {
    chatSearch,
    chats,
    displayName,
    draft,
    error,
    hasMessages,
    isLoadingChats,
    isLoadingMessages,
    isSending,
    messages,
    messagesPanelRef,
    selectedChat,
    selectedChatId,
    setChatSearch,
    setDraft,
    startNewChat,
    selectChat,
    submitDraft,
    visibleChats,
  } = useDashboardChat();

  const composer = (
    <ChatComposer
      draft={draft}
      isSending={isSending}
      onDraftChange={setDraft}
      onSubmit={submitDraft}
    />
  );

  return (
    <main className="grid h-screen overflow-hidden bg-[#212121] text-zinc-100 lg:grid-cols-[280px_minmax(0,1fr)]">
      <DashboardSidebar
        chatSearch={chatSearch}
        chats={chats}
        displayName={displayName}
        isLoadingChats={isLoadingChats}
        onChatSearchChange={setChatSearch}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        selectedChatId={selectedChatId}
        visibleChats={visibleChats}
      />

      <section className="flex min-h-screen min-w-0 flex-col bg-[#212121]">
        <ChatHeader selectedChat={selectedChat} />

        <MessagePanel
          emptyComposer={
            <ChatComposer
              draft={draft}
              isCentered
              isSending={isSending}
              onDraftChange={setDraft}
              onSubmit={submitDraft}
            />
          }
          error={error}
          hasMessages={hasMessages}
          isLoadingMessages={isLoadingMessages}
          messages={messages}
          messagesPanelRef={messagesPanelRef}
        />

        {hasMessages && (
          <div className="shrink-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent px-4 pb-5 pt-10">
            <div className="mx-auto w-full max-w-3xl">
              {error && (
                <p className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                  {error}
                </p>
              )}
              {composer}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
