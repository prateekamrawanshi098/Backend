import { Link } from "react-router";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useChat } from "../../Chat/hooks/useChat";
import { useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const { isConnected, messages, sendMessage, socketId } = useChat();
  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    const outgoingMessage = {
      text: message,
      sender: user?.username || user?.email || "Guest",
    };

    console.log("Sending socket message:", outgoingMessage);
    sendMessage(outgoingMessage);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center">
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 sm:p-8">
          <p className="mb-2 text-sm font-medium text-cyan-300">Perplexity</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Home Page
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            You are logged in successfully.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <p className="text-sm text-zinc-300">
              Socket {isConnected ? "connected" : "disconnected"}
            </p>
            {socketId && (
              <p className="text-xs text-zinc-500">ID: {socketId}</p>
            )}
          </div>

          {user && (
            <div className="mt-6 rounded-md border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">Current user</p>
              <p className="mt-1 font-medium text-white">
                {user.username || user.email}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-md border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm font-medium text-white">Socket messages</p>

            <div className="mt-4 max-h-56 space-y-3 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-zinc-500">No messages yet.</p>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
                  >
                    <p className="text-xs text-cyan-300">{item.sender}</p>
                    <p className="mt-1 text-sm text-zinc-100">{item.text}</p>
                  </div>
                ))
              )}
            </div>

            <form className="mt-4 flex gap-2" onSubmit={handleSendMessage}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Send a socket message"
                className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                type="submit"
                disabled={!isConnected}
                className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                Send
              </button>
            </form>
          </div>

          <Link
            to="/login"
            className="mt-8 inline-flex rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-400 hover:text-cyan-200"
          >
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
