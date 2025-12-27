import React, { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { token, user, hasUnreadMessages } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadChats, setUnreadChats] = useState([]);
  const [admins, setAdmins] = useState([]);


  useEffect(() => {
    if (!token) return;

    const loadAll = async () => {
      const [postData, eventData, chatData] = await Promise.all([
        api.request("/posts", "GET", null, token),
        api.request("/events", "GET", null, token),
        api.request("/messages/recent", "GET", null, token),
      ]);

      const latestPosts = postData
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 3);

      const myEvents = eventData.filter(
        ev => ev.organizerId === user.id || ev.organizerId?._id === user.id
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(today.getDate() + 5);
      fiveDaysLater.setHours(23, 59, 59, 999);

      const upcomingEvents = eventData.filter(ev => {
        const eventDate = new Date(ev.startTime);
        return eventDate >= today && eventDate <= fiveDaysLater;
      });


      const unreadOnly = [];

      for (const u of recentChats) {
        const msgs = await api.request(
          `/messages/${u._id}`,
          "GET",
          null,
          token
        );

        const unreadCount = msgs.filter(
          m => m.to === user.id && m.read === false
        ).length;

        if (unreadCount > 0) {
          unreadOnly.push({
            user: u,
            unreadCount
          });
        }
      }

      const users = await api.request("/users", "GET", null, token);

      const adminUsers = users
        .filter(u => u.role === "admin")
        .slice(0, 3);

      setAdmins(adminUsers);
      setUnreadChats(unreadOnly);
      setPosts(latestPosts);
      setMyEvents(myEvents);
      setEvents(upcomingEvents);
      setRecentChats(chatData.slice(0, 5));
    };

    loadAll();
  }, [token , user, recentChats, hasUnreadMessages, unreadChats]);


  


  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0);

  const totalUnreadMessages = unreadChats.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen text-white">

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Posts" value={posts.length} />
        <Stat title="Likes" value={totalLikes} />
        <Stat title="Events" value={myEvents.length} />
        <div className="relative p-4 rounded-xl bg-gray-900">
          
          {totalUnreadMessages > 0 && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
          )}

          <div className="text-sm text-gray-400">Messages</div>

          <div className="text-2xl font-bold">
            {totalUnreadMessages}
          </div>
        </div>

      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        
      <div className="md:col-span-2 space-y-5">

        
        <div className="h-[45vh] overflow-y-auto no-scrollbar bg-gray-950 rounded-xl p-3">
          <div className="sticky flex justify-center mb-3 top-0 bg-gray-950 z-10">
            <h2 className="font-semibold">Recent Posts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map(post => (
              <div
                key={post._id}
                className="overflow-hidden cursor-pointer hover:scale-[1.02] transition"
              >
                <div className="flex p-2 text-[15px] items-center gap-1 font-medium">
                  <img
                    src={
                      post.ownerId?.avatar
                        ? post.ownerId.avatar
                        : "/images/default-profile.png"
                    }
                    className="w-6 h-6 rounded-full border"
                    alt="avatar"
                  />
                  {post.ownerId?.name}
                  <span className="text-xs font-light text-gray-500 ml-1">
                    posted
                  </span>
                </div>

                <img
                  src={`${import.meta.env.VITE_API_URL}${post.image}`}
                  alt="post"
                  className="w-full h-48 object-cover rounded"
                  onClick={() => navigate("/posts")}
                />
              </div>
            ))}
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-133">
          
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-3 text-sm">
              <button
                onClick={() => navigate("/posts/new")}
                className="bg-gray-800 hover:bg-gray-700 py-2 rounded"
              >
                Create Post
              </button>

              <button
                onClick={() => navigate("/events/new")}
                className="bg-gray-800 hover:bg-gray-700 py-2 rounded"
              >
                Create Event
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="bg-gray-800 hover:bg-gray-700 py-2 rounded"
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate("/messages")}
                className="bg-gray-800 hover:bg-gray-700 py-2 rounded"
              >
                Messages
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold mb-4">Notifications</h3>

            <div className="space-y-3 text-sm text-gray-300">

              {totalUnreadMessages > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-red-400">●</span>
                  <span>
                    You have <b>{totalUnreadMessages}</b> unread message
                    {totalUnreadMessages > 1 && "s"}
                  </span>
                </div>
              )}

              {/* UPCOMING EVENTS */}
              {events.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">●</span>
                  <span>
                    {events.length} event
                    {events.length > 1 && "s"} happening soon
                  </span>
                </div>
              )}

              {/* EMPTY STATE */}
              {totalUnreadMessages === 0 && events.length === 0 && user?.bio && (
                <p className="text-xs text-gray-500 italic">
                  No new notifications
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="space-y-6">

          {/* PROFILE */}
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <img
              src={
                user?.avatar
                  ? user.avatar
                  : "/images/default-profile.png"
              }
              className="w-20 h-20 rounded-full mx-auto border"
              alt="avatar"
            />
            <h3 className="font-semibold mt-2">{user?.name}</h3>
            <p className="text-xs text-gray-400">{user?.role}</p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-2 text-sm underline"
            >
              View Profile
            </button>
          </div>

          {/* EVENTS */}
          <div className="bg-gray-900 h-[45vh] overflow-y-auto no-scrollbar rounded-xl px-4 pb-3">
            <div className="sticky flex justify-center pb-4 top-0 pt-4 z-10 bg-gray-900">
              <h3 className="font-semibold ">Events</h3>
              <button
                onClick={() => navigate("/events")}
                className="absolute right-0 text-xs underline"
              >
                View all
              </button>
            </div>

            {events.map(ev => (
              <div
                key={ev._id}
                className="border mt-2 border-gray-700 py-2 text-sm"
              >
                <div className="font-medium">{ev.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(ev.startTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>


          <div className="bg-gray-900 h-[45vh] overflow-y-auto no-scrollbar rounded-xl">
            <h3 className="font-semibold sticky top-0 py-4 bg-gray-900 ">Unread Messages</h3>

            {unreadChats.length === 0 ? (
              <p className="text-sm text-gray-400">No unread messages</p>
            ) : (
              unreadChats.map(({ user: u, unreadCount }) => (
                <div
                  key={u._id}
                  onClick={() => navigate("/messages")}
                  className="flex justify-between items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
                >

                  <div className="flex items-center gap-3">
                    <img
                      src={
                        u.avatar
                          ? u.avatar
                          : "/images/default-profile.png"
                      }
                      className="w-8 h-8 rounded-full border"
                      alt=""
                    />
                    <div>
                      <div className="text-sm font-medium">{u.name}</div>
                      <div className="text-xs text-left text-gray-400">{u.userId}</div>
                    </div>
                  </div>


                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full text-center">
                    {unreadCount}
                  </span>
                </div>
              ))
            )}
          </div>


        </div>
      </div>

      <div className="mt-6 bg-gray-950 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6 text-center">
          Admin Panel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {admins.map(admin => (
            <div
              key={admin._id}
              className="bg-gray-900 rounded-xl p-4 text-center"
            >
              <img
                src={
                  admin.avatar
                    ? admin.avatar
                    : "/images/default-profile.png"
                }
                alt="admin"
                className="w-20 h-20 rounded-full mx-auto border mb-3"
              />

              <h3 className="font-semibold">{admin.name}</h3>
              <p className="text-xs text-gray-400 mb-3">Admin</p>

              <p className="text-sm text-gray-300 mb-4">
                {admin.email}
              </p>

              <button
                onClick={() =>
                  window.location.href = `mailto:${admin.email}?subject=Support Request from Bizora&body=Dear ${admin.name},`
                }
                className="text-sm hover:text-blue-400"
              >
                Contact Admin
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

const Stat = ({ title, value}) => (
  <div
    className={`p-4 rounded-xl bg-gray-900`}
  >
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default DashboardPage;
