import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useEffect } from "react";

import "./index.css";
import "./App.css";

import LandingPage from "./LandingPage.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import DashboardPage from "./DashboardPage.jsx";
import CommentsPage from "./CommentsPage.jsx";
import FeedPage from "./FeedPage.jsx";
import PostFormPage from "./PostFormPage.jsx";

import EventsListPage from "./EventsListPage.jsx";
import EventFormPage from "./EventFormPage.jsx";
import EventDetailPage from "./EventDetailPage.jsx";

import MessagesPage from "./MessagesPage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import Footer from "./components/Footer.jsx";
import PublicProfilePage from "./PublicProfilePage.jsx";

function App() {

  const { token, checkUnreadMessages } = useAuth();

  useEffect(() => {
    if (token) {
      checkUnreadMessages(token);
    }
  }, [token , checkUnreadMessages]);

  return (
    <div className="app min-h-screen flex flex-col">
      <NavBar />

      <main className="w-full relative z-10 flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* POSTS (Instagram-style) */}
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <FeedPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/new"
            element={
              <PrivateRoute>
                <PostFormPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute>
                <PostFormPage />
              </PrivateRoute>
            }
          />

          <Route path="/posts/:id/comment" 
          element={
            <PrivateRoute>
              <CommentsPage />
            </PrivateRoute>
          } />



          {/* EVENTS */}
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <EventsListPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/events/new"
            element={
              <PrivateRoute>
                <EventFormPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/events/:id"
            element={
              <PrivateRoute>
                <EventDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/events/:id/edit"
            element={
              <PrivateRoute>
                <EventFormPage />
              </PrivateRoute>
            }
          />

          {/* MESSAGES */}
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessagesPage />
              </PrivateRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <PublicProfilePage/>
              </PrivateRoute>
            }
          />
        </Routes>

        <Footer />
      </main>
    </div>
  );
}

export default App;