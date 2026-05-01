import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import {
  getChats,
  getMessages,
  sendChatMessage,
} from "../../Chat/Services/chat.api";

const getErrorMessage = (error, fallbackMessage) => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

export const useDashboardChat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesPanelRef = useRef(null);

  const displayName = user?.username || user?.email || "User";
  const selectedChat = useMemo(
    () => chats.find((chat) => chat._id === selectedChatId),
    [chats, selectedChatId],
  );
  const visibleChats = useMemo(() => {
    const searchTerm = chatSearch.trim().toLowerCase();

    if (!searchTerm) {
      return chats;
    }

    return chats.filter((chat) =>
      (chat.title || "").toLowerCase().includes(searchTerm),
    );
  }, [chatSearch, chats]);
  const hasMessages = messages.length > 0;

  const loadChats = useCallback(async () => {
    setIsLoadingChats(true);
    setError(null);

    try {
      const data = await getChats();
      const nextChats = data.chats || [];

      setChats(nextChats);
      setSelectedChatId((currentChatId) => {
        const currentChatExists = nextChats.some(
          (chat) => chat._id === currentChatId,
        );

        if (currentChatExists) {
          return currentChatId;
        }

        return nextChats[0]?._id || null;
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load chats"));
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadMessages = async () => {
      if (!selectedChatId) {
        setMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      setIsLoadingMessages(true);
      setError(null);

      try {
        const data = await getMessages(selectedChatId);

        if (isCurrentRequest) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        if (isCurrentRequest) {
          setError(getErrorMessage(err, "Unable to load messages"));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoadingMessages(false);
        }
      }
    };

    loadMessages();

    return () => {
      isCurrentRequest = false;
    };
  }, [selectedChatId]);

  useEffect(() => {
    const messagesPanel = messagesPanelRef.current;

    if (!messagesPanel || isLoadingMessages) {
      return;
    }

    messagesPanel.scrollTo({
      top: messagesPanel.scrollHeight,
      behavior: "smooth",
    });
  }, [isLoadingMessages, messages]);

  const startNewChat = useCallback(() => {
    setSelectedChatId(null);
    setMessages([]);
    setError(null);
  }, []);

  const selectChat = useCallback((chatId) => {
    setSelectedChatId(chatId);
  }, []);

  const submitDraft = useCallback(async () => {
    const content = draft.trim();

    if (!content || isSending) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const data = await sendChatMessage({
        chatId: selectedChatId,
        userMessage: content,
      });

      const nextChat = data.chat;
      const nextMessages = [data.userMessage, data.aiMessage].filter(Boolean);

      if (nextChat) {
        setChats((currentChats) => [
          nextChat,
          ...currentChats.filter((chat) => chat._id !== nextChat._id),
        ]);
        setSelectedChatId(nextChat._id);
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        ...nextMessages,
      ]);
      setDraft("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to send message"));
    } finally {
      setIsSending(false);
    }
  }, [draft, isSending, selectedChatId]);

  return {
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
  };
};
