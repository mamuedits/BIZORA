import React, { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";

const ProfilePage = () => {
  const { token, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    startupName: "",
    bio: "",
    skills: "",
    linkedin: "",
    website: "",
    github: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.request("/users/me", "GET", null, token);
        setProfile(data);
        setForm({
          startupName: data.startupName || "",
          bio: data.bio || "",
          skills: (data.skills || []).join(", "),
          linkedin: data.links?.linkedin || "",
          website: data.links?.website || "",
          github: data.links?.github || ""
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      await api.request("/users/me/avatar", "PUT", formData, token, true);
      const updated = await api.request("/users/me", "GET", null, token);
      setProfile(updated);
      updateUser(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await api.request(
        "/users/me",
        "PUT",
        {
          startupName: form.startupName,
          bio: form.bio,
          skills: form.skills
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),
          links: {
            linkedin: form.linkedin,
            website: form.website,
            github: form.github
          }
        },
        token
      );

      const updated = await api.request("/users/me", "GET", null, token);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-6">

        <div className="flex flex-col items-center mb-6">
          <img
            src={profile.avatar ? profile.avatar : "/images/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border border-gray-700"
          />

          <label className="mt-3 text-xs cursor-pointer underline text-gray-400 hover:text-white">
            {uploading ? "Uploading..." : "Change Image"}
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>

        <p className="text-xs text-gray-400 text-center mb-1">
          ID : {profile.userId}
        </p>

        <h2 className="text-2xl font-semibold text-center">
          {profile.name}
        </h2>

        <p className="text-sm text-gray-400 mb-6 text-center">
          {profile.role} • {profile.email}
        </p>

        {!editing ? (
          <>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-400">Startup:</span> {profile.startupName || "-"}</p>
              <p><span className="text-gray-400">Bio:</span> {profile.bio || "-"}</p>
              <p><span className="text-gray-400">Skills:</span> {(profile.skills || []).join(", ") || "-"}</p>

              <p className="text-sm">
                <span className="text-gray-400">Links:</span>{" "}
                {profile.links?.linkedin && (
                  <a href={profile.links.linkedin} className="underline ml-2 text-blue-400">LinkedIn</a>
                )}
                {profile.links?.website && (
                  <a href={profile.links.website} className="underline ml-2 text-blue-400">Website</a>
                )}
                {profile.links?.github && (
                  <a href={profile.links.github} className="underline ml-2 text-blue-400">GitHub</a>
                )}
              </p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 text-sm">
            <input 
            className="bg-gray-800 p-2 rounded-lg" 
            name="startupName"
            placeholder="Startup Name"
            value={form.startupName}
            onChange={handleChange}/>

            <textarea 
            className="bg-gray-800 p-2 rounded-lg" 
            name="bio"
            placeholder="Bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}/>

            <input 
            className="bg-gray-800 p-2 rounded-lg"
            name="skills"
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={handleChange}/>

            <input 
            className="bg-gray-800 p-2 rounded-lg"
            name="linkedin"
            placeholder="LinkedIn URL"
            value={form.linkedin}
            onChange={handleChange}/>

            <input 
            className="bg-gray-800 p-2 rounded-lg"
            name="website"
            placeholder="Website URL"
            value={form.website}
            onChange={handleChange}
            />

            <input
              name="github"
              placeholder="GitHub URL"
              value={form.github}
              onChange={handleChange}
              className="bg-gray-800 p-2 rounded-lg"
            />

            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
                Save
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default ProfilePage;
