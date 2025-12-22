import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { useEffect } from "react";

const PostFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const nav = useNavigate();

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadPost = async () => {
      try {
        const post = await api.request(`/posts/${id}`, "GET", null, token);

        setCaption(post.caption || "");
        setHashtags(post.hashtags?.join(",") || "");
      } catch (err) {
        console.error(err);
      }
    };
    loadPost();
  }, [id, isEdit, token]);

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("caption", caption);
    formData.append("hashtags", hashtags);

    if (isEdit) {
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
    } else {
      await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
    }

    nav("/posts");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {isEdit ? "Edit Post" : "Create Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="text-sm"
          />

          <textarea
            placeholder="Write something..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
            required
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <input
            placeholder="#startup #tech"
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium">
            {isEdit ? "Save Changes" : "Share Post"}
          </button>
        </form>
      </div>
    </div>
  );

};

export default PostFormPage;
