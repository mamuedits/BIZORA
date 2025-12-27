import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";

const CommentsPage = () => {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      const data = await api.request(
        `/posts/${id}/comments`,
        "GET",
        null,
        token
      );
      setComments(data);
    };
    loadComments();
  }, [id, token]);

  const handleAddOrEdit = async () => {
    if (!text.trim()) return;

    if (editingId) {
      const updatedComments = await api.request(
        `/posts/${id}/comment/${editingId}`,
        "PUT",
        { text },
        token
      );
      setComments(updatedComments);
      setEditingId(null);
      setText("");
      return;
    }

    const updatedComments = await api.request(
      `/posts/${id}/comment`,
      "POST",
      { text },
      token
    );
    setComments(updatedComments);
    setText("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setMenuOpen(null);
  };

  const handleDelete = async (commentId) => {
    const updatedComments = await api.request(
      `/posts/${id}/comment/${commentId}`,
      "DELETE",
      null,
      token
    );
    setComments(updatedComments);
    setMenuOpen(null);
  };

  const handleEdit = (comment) => {
    setText(comment.text);
    setEditingId(comment._id);
    setMenuOpen(null);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-lg mx-auto bg-black min-h-screen px-3 py-4 text-white">
      {/* INPUT */}
      <div className="sticky top-0 bg-black z-10 pb-3">
        <div className="flex gap-2 items-center bg-gray-900 rounded-xl p-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button
            onClick={handleAddOrEdit}
            className="text-blue-400 text-sm font-medium"
          >
            {editingId ? "Update" : "Send"}
          </button>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="space-y-4 mt-4">
        {[...comments].reverse().map(comment => {
          const isAdmin = user?.role === "admin";
          const isOwner = comment.userId._id === user?.id;

          return (
            <div key={comment._id} className="flex justify-between gap-2">
              <div className="flex gap-3">
                <img
                  src={
                    comment.userId.avatar
                      ? `${import.meta.env.VITE_API_URL}${comment.userId.avatar}`
                      : "/images/default-profile.png"
                  }
                  className="w-8 h-8 rounded-full"
                  alt=""
                />

                <div className="bg-gray-900 rounded-xl px-3 py-2 max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">
                      {comment.userId.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-left">{comment.text}</p>
                </div>
              </div>

              {/* MENU */}
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === comment._id ? null : comment._id)
                  }
                  className="text-gray-400 px-2"
                >
                  ⋮
                </button>

                {menuOpen === comment._id && (
                  <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-sm z-10">
                    {(isAdmin || isOwner) && (
                      <button
                        onClick={() => handleEdit(comment)}
                        className="block px-4 py-2 hover:bg-gray-800 w-full text-left"
                      >
                        Edit
                      </button>
                    )}
                    {(isAdmin || isOwner) && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="block px-4 py-2 text-red-400 hover:bg-gray-800 w-full text-left"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(comment.text)}
                      className="block px-4 py-2 hover:bg-gray-800 w-full text-left"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

};

export default CommentsPage;
