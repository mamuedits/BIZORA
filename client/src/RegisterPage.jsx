import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";

const RegisterPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "investor",
  });

  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);
      formData.append("role", form.role);
      formData.append("avatar", avatar);
      

      const res = await api.request(
        "/auth/register",
        "POST",
        formData,
        null,
        true 
      );

      login(res.token, res.user);
      nav("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="bg-red-900/40 text-red-400 text-sm p-2 rounded mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

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

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
          >
            <option value="founder">Founder</option>
            <option value="collaborator">Collaborator</option>
            <option value="investor">Investor</option>
            <option value="mentor">Mentor</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );

};

export default RegisterPage;
