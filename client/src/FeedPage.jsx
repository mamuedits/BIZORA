import React, { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await api.request("/posts", "GET", null, token);
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) loadFeed();
  }, [token]);

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const handleLike = async (id) => {
    try {
      const updatedPost = await api.request(
        `/posts/${id}/like`,
        "POST",
        null,
        token
      );

      setPosts(prev =>
        prev.map(post =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto bg-black px-2 py-2">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-semibold text-white">Feed</h2>
          <button
            onClick={() => navigate("/posts/new")}
            className="bg-blue-600 but hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >
            New Post
          </button>
        </div>

        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
