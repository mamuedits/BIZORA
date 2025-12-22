import React, { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EventFormPage = () => {
  const { token} = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Workshop",
    mode: "online",
    location: "",
    meetingLink: "",
    startTime: "",
    endTime: "",
    maxParticipants: ""
  });

  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    const load = async () => {
      const { event } = await api.request(`/events/${id}`, "GET", null, token);

      setForm({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "Workshop",
        mode: event.mode || "online",
        location: event.location || "",
        meetingLink: event.meetingLink || "",
        startTime: event.startTime?.slice(0, 16) || "",
        endTime: event.endTime?.slice(0, 16) || "",
        maxParticipants: event.maxParticipants || ""
      });
    };

    load();
  }, [id, isEdit, token]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();


    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (banner) {
      formData.append("banner", banner);
    }

    const path = isEdit ? `/events/${id}` : "/events";
    const method = isEdit ? "PUT" : "POST";

    await api.request(path, method, formData, token, true);
    navigate(`/events/${isEdit ? id : ""}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {isEdit ? "Edit Event" : "Create Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <textarea
            name="description"
            placeholder="Event description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
            >
              <option>WORKSHOP</option>
              <option>HACKATHON</option>
              <option>MEETUP</option>
              <option>WEBINAR</option>
              <option>CONFERENCE</option>
            </select>

            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {(form.mode !== "offline") && (
            <input
              name="meetingLink"
              placeholder="Meeting link"
              value={form.meetingLink}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
            />
          )}

          {(form.mode !== "online") && (
            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
            />
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
            />
          </div>

          <input
            type="number"
            name="maxParticipants"
            placeholder="Max participants"
            value={form.maxParticipants}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <input
            type="file"
            accept="image/*"
            onChange={e => setBanner(e.target.files[0])}
            className="text-sm bg-gray-800 border border-gray-700 p-3 rounded-lg w-full"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium">
            Save Event
          </button>
        </form>
      </div>
    </div>
  );

};

export default EventFormPage;
