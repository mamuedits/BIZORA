import React, { useEffect, useState, useRef } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [recentChats, setRecentChats] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const messagesContainerRef = useRef(null);

  /* ================= LOAD RECENT CHATS ================= */
  useEffect(() => {
    if (!token) return;

    const loadRecentChats = async () => {
      const data = await api.request(
        "/messages/recent",
        "GET",
        null,
        token
      );
      setRecentChats(data);
    };

    loadRecentChats();
  }, [token]);

  /* ================= UNREAD COUNTS PER USER ================= */
  useEffect(() => {
    if (!token || !user) return;

    const loadUnreadCounts = async () => {
      const counts = {};

      for (const u of recentChats) {
        if (!u?._id) continue;

        const msgs = await api.request(
          `/messages/${u._id}`,
          "GET",
          null,
          token
        );

        const unread = msgs.filter(
          m =>
            String(m.to) === String(user.id || user._id) &&
            m.read === false
        ).length;

        if (unread > 0) {
          counts[u._id] = unread;
        }
      }

      setUnreadCounts(counts);
    };

    loadUnreadCounts();
  }, [recentChats, token, user]);

  /* ================= MARK READ WHEN OPEN CHAT ================= */
  useEffect(() => {
  if (!chatUser || !token) return;

  const markReadAndUpdateUI = async () => {
    // external side-effect
    await api.request(
      `/messages/read/${chatUser._id}`,
      "PUT",
      null,
      token
    );

    // UI update AFTER async call (eslint-safe)
    setUnreadCounts(prev => {
      const copy = { ...prev };
      delete copy[chatUser._id];
      return copy;
    });
  };

  markReadAndUpdateUI();
}, [chatUser, token]);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!chatUser) return;

    const loadMessages = async () => {
      const data = await api.request(
        `/messages/${chatUser._id}`,
        "GET",
        null,
        token
      );
      setMessages(data);
    };

    loadMessages();
  }, [chatUser, token]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ================= SEARCH USER ================= */
  const handleSearch = async e => {
    e.preventDefault();
    setError("");

    try {
      const found = await api.request(
        `/users/by-userid/${searchId}`,
        "GET",
        null,
        token
      );
      setChatUser(found);
      setSearchId("");
    } catch {
      setError("User ID not found");
    }
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async e => {
    e.preventDefault();
    if (!content.trim()) return;

    await api.request(
      `/messages/${chatUser._id}`,
      "POST",
      { content },
      token
    );

    setContent("");

    const data = await api.request(
      `/messages/${chatUser._id}`,
      "GET",
      null,
      token
    );
    setMessages(data);
  };

  /* ================= DELETE MESSAGE ================= */
  const deleteMessage = async messageId => {
    await api.request(`/messages/${messageId}`, "DELETE", null, token);
    setMessages(prev => prev.filter(m => m._id !== messageId));
    setSelectedMessageId(null);
  };

  return (
    <div className="h-[88vh] bg-black text-white flex">

      {/* LEFT */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col">
        <form onSubmit={handleSearch} className="p-3 border-b border-gray-800">
          <input
            placeholder="Search userId"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </form>

        <div className="flex-1 overflow-y-auto">
          {recentChats.map(u => (
            <div
              key={u._id}
              onClick={() => setChatUser(u)}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-900"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={u.avatar ? `${import.meta.env.VITE_API_URL}${u.avatar}` : "/images/default-profile.png"}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-left text-gray-400">{u.userId}</div>
                </div>
              </div>

              {unreadCounts[u._id] && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCounts[u._id]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-2/3 flex flex-col">
        {!chatUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <img
                src={chatUser.avatar ? `${import.meta.env.VITE_API_URL}${chatUser.avatar}` : "/images/default-profile.png"}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => navigate(`/profile/${chatUser._id}`)}
                alt=""
              />
              <div>
                <div className="font-semibold">
                  {chatUser.name}{" "}
                  <span className="text-xs text-gray-400">{chatUser.role}</span>
                </div>
                <div className="text-xs text-left text-gray-400">{chatUser.userId}</div>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar"
            >
              {messages.map(m => {
                const fromId =
                  typeof m.from === "string" ? m.from : m.from?._id;
                const isMe =
                  String(fromId) === String(user.id || user._id);

                return (
                  <div
                    key={m._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className="relative">
                      <div
                        onClick={() =>
                          isMe
                            ? setSelectedMessageId(
                                selectedMessageId === m._id ? null : m._id
                              )
                            : null
                        }
                        className={`px-3 py-2 rounded-xl max-w-xs text-sm cursor-pointer ${
                          isMe
                            ? "bg-green-500 text-black"
                            : "bg-white text-black"
                        }`}
                      >
                        {m.content}
                      </div>

                      {isMe && selectedMessageId === m._id && (
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="absolute top-3 -left-12 text-xs text-red-500"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={sendMessage}
              className="p-3 border-t border-gray-800 flex gap-2"
            >
              <input
                value={content}
                onChange={e => setContent(e.target.value)}
                className="flex-1 bg-gray-900 rounded-lg px-3 py-2 text-sm"
                placeholder="Type a message"
              />
              <button className="bg-green-600 px-4 rounded-lg">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
