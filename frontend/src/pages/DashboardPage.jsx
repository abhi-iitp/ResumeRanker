import React, { useEffect, useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UploadCloud,
  Users,
  Briefcase,
  Bell,
  Settings,
  Search,
  LogOut,
  TrendingUp,
  FileText,
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  Activity,
  Brain,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const pieColors = ["#7c3aed", "#06b6d4", "#f59e0b", "#ef4444"];

const recentCandidates = [
  { name: "Douglas Ray", role: "Applied for iOS Developer" },
  { name: "Elizabeth Martin", role: "Applied for Full Stack Developer" },
  { name: "Emma Wade", role: "Applied for Product Designer" },
  { name: "Teresa Reyes", role: "Applied for Design Lead" },
];

const alerts = [
  "3 resumes matched above 90% today",
  "2 candidates shortlisted automatically",
  "1 new job description added",
  "Parsing pipeline running smoothly",
];

function Ring({ value, label, color = "#7c3aed" }) {
  const size = 120;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold">{value}%</span>
          <span className="text-[11px] text-white/45">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { logout } = useAuth();

  const [summary, setSummary] = useState({
    applications: 0,
    shortlisted: 0,
    hold: 0,
    rejected: 0,
  });

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/reports/summary");
        const data = await res.json();

        const applications = data.applications ?? 0;
        const shortlisted = data.shortlisted ?? 0;
        const hold = data.hold ?? data.onhold ?? 0;
        const rejected = data.rejected ?? 0;

        setSummary({
          applications,
          shortlisted,
          hold,
          rejected,
        });

        setPieData([
          { name: "Shortlisted", value: shortlisted },
          { name: "Hold", value: hold },
          { name: "Rejected", value: rejected },
        ]);

        setLineData([
          { name: "Applications", value: applications },
          { name: "Shortlisted", value: shortlisted },
          { name: "Hold", value: hold },
          { name: "Rejected", value: rejected },
        ]);
      } catch (err) {
        console.log("Graph fetch error:", err);
      }
    };

    const fetchCandidates = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/candidates");
        const data = await res.json();
        setCandidates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Candidates fetch error:", err);
      }
    };

    fetchSummary();
    fetchCandidates();

    const interval = setInterval(() => {
      fetchSummary();
      fetchCandidates();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredCandidates = candidates.filter((c) => {
  const name = (c.name || "").toLowerCase();
  const email = (c.email || "").toLowerCase();
  const decision = (c.decision || "").toLowerCase();
  const score = Number(c.score || 0);

  const matchesSearch =
    name.includes(searchTerm.toLowerCase()) ||
    email.includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || decision === statusFilter;

  const matchesScore =
    scoreFilter === "all"
      ? true
      : scoreFilter === "90+"
      ? score >= 90
      : scoreFilter === "70-89"
      ? score >= 70 && score < 90
      : score < 70;

  return matchesSearch && matchesStatus && matchesScore;
});

  const stats = [
    {
      title: "Applications",
      value: summary.applications,
      change: "+5%",
      icon: FileText,
      glow: "from-pink-500 to-fuchsia-500",
    },
    {
      title: "Shortlisted",
      value: summary.shortlisted,
      change: "+14%",
      icon: CheckCircle2,
      glow: "from-cyan-500 to-sky-500",
    },
    {
      title: "Hold",
      value: summary.hold,
      change: "-4%",
      icon: Bell,
      glow: "from-amber-500 to-orange-500",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      change: "+8%",
      icon: TrendingUp,
      glow: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen text-white bg-[#070b18] overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.25),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.20),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.10),_transparent_30%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-28 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      <div className="relative flex min-h-screen">
        <aside className="hidden xl:flex w-72 flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl p-5">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
              RS
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Resume Rank Ai</h1>
              <p className="text-xs text-white/50">AI Hiring Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", LayoutDashboard],
              ["Upload Resume", UploadCloud],
              ["Candidates", Users],
              ["Reports", Briefcase],
              ["Notifications", Bell],
              ["Settings", Settings],
            ].map(([label, Icon], i) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  i === 0
                    ? "bg-white/10 text-white shadow-lg shadow-black/20"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-cyan-500/10 border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles size={16} />
              <p className="text-sm font-medium">Pro Insights</p>
            </div>
            <h3 className="mt-2 text-xl font-semibold">AI screening is active</h3>
            <p className="mt-2 text-sm text-white/60">
              Upload resumes, score candidates, and track hiring performance in one place.
            </p>
            <button className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-medium hover:opacity-90 transition">
              Upgrade
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 xl:p-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shadow-xl shadow-black/20">
            <div>
              <p className="text-white/50 text-sm">Welcome back,</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-semibold">Recruitment Dashboard</h2>
                <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                  <Activity size={12} />
                  Live AI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/60 w-80">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search candidate or role..."
                  className="bg-transparent outline-none w-full text-sm placeholder:text-white/35"
                />
              </div>
              <button className="rounded-2xl bg-white/10 p-3 hover:bg-white/15 transition">
                <Bell size={18} />
              </button>
              <button
                onClick={logout}
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-[1fr_340px] gap-6">
            <section className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-indigo-600/30 via-fuchsia-500/20 to-cyan-500/20 p-6 md:p-8 shadow-2xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%)]" />
                <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                      <Brain size={12} />
                      Smart Resume Screening System
                    </div>
                    <h3 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                      Make hiring faster, cleaner, and more intelligent.
                    </h3>
                    <p className="mt-4 max-w-2xl text-white/70">
                      Upload resumes, analyze candidate fit, and visualize ranking scores with a premium AI dashboard experience.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-2xl bg-white text-[#0b1020] px-5 py-3 text-sm font-semibold hover:scale-[1.02] transition">
                        Upload Resume
                      </button>
                      <button className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition">
                        View Reports
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-white/45">AI Match Rate</p>
                      <div className="mt-4">
                        <Ring value={92} label="match" color="#22d3ee" />
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-white/45">Precision</p>
                      <div className="mt-4">
                        <Ring value={88} label="score" color="#ec4899" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:-translate-y-1 transition duration-300 shadow-xl shadow-black/20"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-white/55">{item.title}</p>
                          <h3 className="mt-2 text-3xl font-bold">{item.value}</h3>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.glow} border border-white/10 flex items-center justify-center`}>
                          <Icon size={20} />
                        </div>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                        <TrendingUp size={14} />
                        {item.change} this month
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-6 shadow-xl shadow-black/20"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-semibold">Upload & Analyze</h3>
                    <p className="text-sm text-white/45">Drop a resume and let the AI extract the details.</p>
                  </div>
                  <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    <ShieldCheck size={12} />
                    Secure parsing
                  </div>
                </div>

                <ResumeUpload />
              </motion.div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-6 shadow-xl shadow-black/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-semibold">Candidate History</h3>
                    <p className="text-sm text-white/45">Live candidates from backend</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Search by name/email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/35"
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    >
                      <option value="all">All</option>
                      <option value="shortlist">Shortlist</option>
                      <option value="hold">Hold</option>
                      <option value="reject">Reject</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/50 border-b border-white/10">
                        <th className="py-3 pr-4">Name</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3 pr-4">Score</th>
                        <th className="py-3 pr-4">Decision</th>
                        <th className="py-3 pr-4">Skills</th>
                        <th className="py-3 pr-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((c, index) => (
                          <tr
                            key={index}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="py-4 pr-4 font-medium">{c.name || "N/A"}</td>
                            <td className="py-4 pr-4 text-white/70">{c.email || "N/A"}</td>
                            <td className="py-4 pr-4">{c.score ?? 0}%</td>
                            <td className="py-4 pr-4">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                  c.decision === "shortlist"
                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"
                                    : c.decision === "hold"
                                    ? "bg-amber-500/15 text-amber-300 border border-amber-400/20"
                                    : "bg-rose-500/15 text-rose-300 border border-rose-400/20"
                                }`}
                              >
                                {c.decision || "N/A"}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-white/60">
                              {Array.isArray(c.skills) && c.skills.length > 0
                                ? c.skills.slice(0, 3).join(", ")
                                : "N/A"}
                            </td>
                            <td className="py-4 pr-4 text-white/50">{c.date || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-white/45">
                            No candidates found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-5">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-semibold">Live Hiring Summary</h3>
                      <p className="text-sm text-white/45">Auto-updated from backend every few seconds</p>
                    </div>
                    <div className="text-sm text-cyan-300">Live</div>
                  </div>

                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="name" stroke="#8aa0c7" />
                        <YAxis stroke="#8aa0c7" />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(10,15,30,0.95)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "16px",
                            color: "#fff",
                          }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                    <h3 className="text-xl font-semibold mb-4">Acquisitions</h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                            {pieData.map((entry, index) => (
                              <Cell key={entry.name} fill={pieColors[index]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "rgba(10,15,30,0.95)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: "16px",
                              color: "#fff",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                    <h3 className="text-xl font-semibold mb-4">Recent Applicants</h3>
                    <div className="space-y-4">
                      {recentCandidates.map((cand) => (
                        <div
                          key={cand.name}
                          className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5 hover:bg-white/10 transition"
                        >
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-sm font-semibold">
                            {cand.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{cand.name}</p>
                            <p className="text-xs text-white/45">{cand.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Resume Pipeline</h3>
                    <span className="text-sm text-white/45">Today</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      ["Upload Resume", "Drag & drop files", UploadCloud],
                      ["Parse & Extract", "Text, skills, experience", FileText],
                      ["Rank Candidates", "Score with JD match", Star],
                    ].map(([title, desc, Icon]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-black/30 hover:-translate-y-1 transition"
                      >
                        <div className="h-11 w-11 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-3">
                          <Icon size={18} />
                        </div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="mt-1 text-sm text-white/45">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {["Upload Resume", "View Ranking", "Export Report", "Open Dashboard"].map((x) => (
                      <button
                        key={x}
                        className="w-full rounded-2xl bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition border border-white/5"
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 text-center shadow-xl shadow-black/20">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-pink-500 to-orange-300 p-[3px]">
                  <div className="h-full w-full rounded-full bg-[#0b1020] flex items-center justify-center text-3xl font-bold">
                    A
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Aditya Kumar</h3>
                <p className="text-sm text-white/45">Backend & Integration</p>
                <button className="mt-5 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-medium hover:bg-indigo-400 transition">
                  View Profile
                </button>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                <h3 className="text-xl font-semibold mb-4">Live Alerts</h3>
                <div className="space-y-3">
                  {alerts.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-2xl bg-black/20 p-3 border border-white/5"
                    >
                      <div className="h-9 w-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                        <Sparkles size={16} className="text-cyan-300" />
                      </div>
                      <p className="text-sm text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-xl shadow-black/20">
                <h3 className="text-xl font-semibold mb-4">Activity</h3>
                <div className="space-y-3">
                  {[
                    "3 resumes parsed today",
                    "2 candidates shortlisted",
                    "1 job description updated",
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 rounded-2xl bg-black/20 p-3 border border-white/5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-300" />
                      </div>
                      <p className="text-sm text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}