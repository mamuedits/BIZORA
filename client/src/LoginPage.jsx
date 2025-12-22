import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.request("/auth/login", "POST", form);
      login(res.token, res.user);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">Welcome Back</h2>

        {error && (
          <p className="bg-red-900/40 text-red-400 text-sm p-2 rounded mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          No account?{" "}
          <Link to="/register" className="underline text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );

};

export default LoginPage;
