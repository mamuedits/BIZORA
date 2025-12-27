import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";

const PostCard = ({ post,user, onLike, onDelete }) => {

  const [menuOpen, setMenuOpen] = useState(null);
  const isOwner = post.ownerId._id === user.id;
  const navigate = useNavigate();
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(false);  


  const liked = post.likes.some(l =>
    (typeof l === "string" ? l : l._id) === user._id
  );

  console.log(liked);
  const handleDelete = async (id) => {
    try {
      await api.request(`/posts/${id}`, "DELETE", null, token);
      onDelete(id);
      setMenuOpen(null);
      
    } catch (err) {
      console.error(err);
    }
  };


  const formatTime = date => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  return (
    <div className="bg-gray-950 px-3 flex flex-col my-1 bg-blurred-lg rounded">
      
      {/* Header */}
      <div className="p-3 font-semibold text-left flex items-center gap-2 ">
        <img src={
                post?.ownerId.avatar
                  ? `${import.meta.env.VITE_API_URL}${post.ownerId.avatar}`
                  : "/images/default-profile.png"
              }
              alt="Profile"
              title="Profile"
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-600 hover:ring-2 hover:ring-blue-500"
            />
            <div className="flex flex-col">
              <div>{post.ownerId.name} | {post.ownerId.userId}</div>
              <div className="text-gray-400 text-[10px]">
                {formatTime(post.createdAt)}
              </div>
            </div>

            <div className="ml-auto relative">
              <button onClick={() => setMenuOpen(!menuOpen)}>⋮</button>

              {menuOpen && (
                <div className="absolute right-0  bg-gray-800 text-sm rounded w-25 shadow z-10">
                  <button
                    className="block px-3 py-2 hover:bg-gray-700 w-full text-left"
                    onClick={() => navigate(`/profile/${post.ownerId._id}`)}
                  >
                    View Profile
                  </button>

                  {isOwner ? (
                    <>
                      <button
                        className="block px-3 py-2 hover:bg-gray-700 w-full text-left"
                        onClick={() => navigate(`/posts/${post._id}/edit`)}
                      >
                        Edit
                      </button>

                      <button
                        className="block px-3 py-2 hover:bg-red-700 text-red-400 w-full text-left"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button className="block px-3 py-2 hover:bg-gray-700 w-full text-left">
                      Report
                    </button>
                  )}
                </div>
              )}
            </div>
      </div>
      




      {/* Image */}
      <img
        src={`${import.meta.env.VITE_API_URL}${post.image}`}
        alt="post"
        className="w-full max-h-[450px] object-cover border rounded-md"
      />


      {/* Actions */}
      <div className="p-2 flex gap-4 text-lg">
        <button onClick={() => onLike(post._id)}>
          {liked ? "❤️" : "🤍"} {post.likes.length}
        </button>
        <Link to={`/posts/${post._id}/comment`}>
          💬 {post.comments.length}
        </Link>
      </div>

      {/* Caption */}
      <div className="px-2 pb-3 text-[10px] text-left">
        <b>{post.ownerId.name}</b>{" "}
        
        <p
    className={`mt-1 whitespace-pre-line ${
      expanded ? "" : "line-clamp-1"
    }`}
  >
    {post.caption}
  </p>

  {post.caption.length > 80 && (
    <button
      onClick={() => setExpanded(!expanded)}
      className="text-gray-400 text-[10px]"
    >
      {expanded ? "Read less" : "Read more"}
    </button>
  )}



          <div className="flex flex-wrap gap-1 text-blue-400 text-[10px]">
            {post.hashtags?.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
      </div>
    </div>
  );
};

export default PostCard;
