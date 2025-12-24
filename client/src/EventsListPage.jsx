import React, { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";

const EventsListPage = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.request("/events", "GET", null, token);
      setEvents(data);
    };
    load();
  }, [token]);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Events</h2>
        <Link
          to="/events/new"
          className="bg-blue-600 but  hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
        >
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(ev => (
          <div
            key={ev._id}
            className="bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.02] transition"
          >
            {ev.bannerUrl && (
              <img
                src={`${import.meta.env.VITE_API_URL}${ev.bannerUrl}`}
                alt="event"
                className="w-full h-[45vh] object-cover rounded-2xl p-2"
              />
            )}

            <div className="p-4">
              <h3 className="font-semibold">{ev.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(ev.startTime).toLocaleString()} •{" "}
                {ev.mode?.toUpperCase()}
              </p>

              <Link
                to={`/events/${ev._id}`}
                className="inline-block mt-3 text-sm underline text-blue-400"
              >
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default EventsListPage;
