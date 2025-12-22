/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const updateUser = updatedUser => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const checkUnreadMessages = async token => {
    const res = await api.request(
      "/messages/unread/check",
      "GET",
      null,
      token
    );
    setHasUnreadMessages(res.hasUnread);
  };


  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, updateUser , hasUnreadMessages, checkUnreadMessages}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
