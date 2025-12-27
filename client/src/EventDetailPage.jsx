import React, { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { useParams,useNavigate } from "react-router-dom";

const EventDetailPage = () => {
  const { token,user } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [message, setMessage] = useState("\n");
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.request(`/events/${id}`, "GET", null, token);
    setData(res);
  };

  const handleEditEvent = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    await api.request(`/events/${id}`, "DELETE", null, token);
    navigate("/events");
  };


  useEffect(() => {
    const fetchData = async () => {
        const res = await api.request(`/events/${id}`, "GET", null, token);
        setData(res);
    };
    fetchData();
    }, [id, token])

  const handleRSVP = async status => {
    setMessage("");
    await api.request(`/events/${id}/register`, "POST", { status }, token);
    setRsvpStatus(status);
    setMessage(`You are marked as "${status}" for this event.`);
    load();
  };

  const handleResetRSVP = async () => {
    await api.request(`/events/${id}/register`, "DELETE", null, token);
    setRsvpStatus("");
    setMessage("");
    load();
  };

  if (!data) return <div className="p-8">Loading...</div>;

  const { event, attendees } = data;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl overflow-hidden">

        {event.bannerUrl && (
          <img
            src={`${import.meta.env.VITE_API_URL}${event.bannerUrl}`}
            alt="banner"
            className="w-full h-[65vh] object-cover p-2 rounded-2xl"
          />
        )}

        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">{event.title}</h2>

          <p className="text-sm text-gray-400">
            Hosted by <span className="font-medium">{event.organizerId?.name}</span>
          </p>

          <div className="text-sm text-gray-400">
            {new Date(event.startTime).toLocaleString()} –{" "}
            {new Date(event.endTime).toLocaleString()}
          </div>

          <div className="flex gap-3 text-xs justify-center text-gray-300">
            <span className="bg-yellow-800 px-3 py-1 rounded-lg">
              {event.category}
            </span>
            <span className="bg-yellow-800 px-3 py-1 rounded-lg">
              {event.mode?.toUpperCase()}
            </span>
          </div>

          {event.location && (
            <p className="text-sm">
              <span className="text-gray-400">{event.location}</span>
            </p>
          )}

          {event.meetingLink && (
            <a
              href={`https://${event.meetingLink}`}
              target="_blank"
              className="text-blue-400 underline text-sm"
            >
              Join Meeting
            </a>
          )}

          <p className="text-gray-300">{event.description}</p>

          <p className="text-sm text-gray-400">
            Attendees (Going): {attendees}
          </p>

          {/* RSVP */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleRSVP("going")}
              className={`px-4 py-2 rounded-lg text-sm ${
                rsvpStatus === "going"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              I’m Going
            </button>

            <button
              onClick={() => handleRSVP("interested")}
              className={`px-4 py-2 rounded-lg text-sm ${
                rsvpStatus === "interested"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Interested
            </button>

            <button
              onClick={handleResetRSVP}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 hover:bg-gray-700"
            >
              Reset
            </button>
          </div>

          {message && (
            <p className="text-sm text-green-400">{message}</p>
          )}
  
          {/* OWNER ACTIONS */}
          {user?.id === event.organizerId?._id || user.role === "admin"(
            <div className="flex gap-3 justify-end pt-6">
              <button
                onClick={handleEditEvent}
                className="text-sm underline hover:text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteEvent}
                className="text-sm underline text-red-400"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default EventDetailPage;
