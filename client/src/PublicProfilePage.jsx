import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await api.request(`/users/${id}`);
      setProfile(data);
    };
    loadProfile();
  }, [id]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-gray-900 rounded-2xl p-6 text-center">

        <img
          src={
            profile.avatar
              ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
              : "/images/default-profile.png"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border border-gray-700 mx-auto mb-4 object-cover"
        />

        <p className="text-xs text-gray-400 mb-1">
          ID : {profile.userId}
        </p>

        <h2 className="text-2xl font-semibold">
          {profile.name}
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          {profile.role}
        </p>

        <div className="space-y-3 text-sm">
          <p><span className="text-gray-400">Startup:</span> {profile.startupName || "-"}</p>
          <p><span className="text-gray-400">Bio:</span> {profile.bio || "-"}</p>
          <p><span className="text-gray-400">Skills:</span> {profile.skills?.join(", ") || "-"}</p>
        </div>

      </div>
    </div>
  );
};

export default PublicProfilePage;
