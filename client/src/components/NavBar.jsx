import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  

  return (
    <nav className="flex items-center justify-between px-6 py-5 border-black bg-gray-900 shadow-sm">
      
      <div className="flex items-center gap-2">
        <img
          src="/images/logouppng.png"
          alt="Logo"
          className="w-8 h-9"
        />
        <Link to="/" className="font-bold text-xl text-[#1A5F8A]">
          BIZORA
        </Link>
      </div>

      <div className="flex items-center gap-6 text-[16px] font-medium text-gray-200">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/events">Events</Link>
            <Link to="/posts">Posts</Link>
            <Link to="/messages">Messages
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-1 rounded hover:text-white text-gray-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-2 py-1 rounded text-white"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={logout}
              className="px-2 py-1 butsp rounded text-white"
            >
              Logout
            </button>

            

            <img
              src={
                user.avatar
                  ? `${import.meta.env.VITE_API_URL}${user.avatar}`
                  : "/images/default-profile.png"
              }
              alt="Profile"
              title="Profile"
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full object-cover cursor-pointer border border-gray-600 hover:ring-2 hover:ring-blue-500"
            />
          </>
        )}
      </div>

    </nav>
  );
};

export default NavBar;
