import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, UserPlus, LogIn } from "lucide-react";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSignupDefault = location.pathname === "/signup";

  const [mode, setMode] = useState(isSignupDefault ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result =
      mode === "login"
        ? login(email, password)
        : register(email, password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b18] flex items-center justify-center p-5 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-center">ResumeRanker</h1>
        <p className="text-center text-white/50 mt-2">
          AI Recruitment Dashboard
        </p>

        <div className="mt-6 flex rounded-2xl bg-black/20 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-[#0b1020]"
                : "text-white/70 hover:text-white"
            }`}
          >
            <LogIn size={16} className="inline mr-2" />
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium transition ${
              mode === "signup"
                ? "bg-white text-[#0b1020]"
                : "text-white/70 hover:text-white"
            }`}
          >
            <UserPlus size={16} className="inline mr-2" />
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-white/60">Email</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter Gmail address"
                className="bg-transparent outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60">Password</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Enter password"
                className="bg-transparent outline-none w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 font-semibold hover:opacity-90 transition"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}