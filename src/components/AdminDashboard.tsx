"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import axios from "axios";

type AdminUser = {
  businessName: string;
  supportEmail: string;
  ownerId: string;
  createdAt: string | null;
  totalQuestions: number;
  lastChatAt: string | null;
  configured: boolean;
};

type AdminStats = {
  summary: {
    totalUsers: number;
    configuredBots: number;
    totalQuestions: number;
    botsWithActivity: number;
    pageViews: number;
    ctaClicks: number;
    topChatbot: AdminUser | null;
  };
  users: AdminUser[];
  recentChatActivity: AdminUser[];
  traffic: {
    pageViews: number;
    ctaClicks: number;
    eventsByType: { type: string; count: number }[];
    topPaths: { path: string; count: number }[];
    recentEvents: {
      type: string;
      path: string;
      label?: string;
      referrer?: string;
      createdAt?: string;
    }[];
  };
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatRelative(value: string | null | undefined) {
  if (!value) return "No activity";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="mt-2 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function AdminDashboard({ email }: { email: string }) {
  const navigate = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.get("/api/admin/stats");
      setStats(result.data);
    } catch {
      setError("Could not load admin analytics. Refresh or check your session.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-lg font-semibold tracking-tight cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            Apna <span className="text-zinc-400">AI</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => navigate.push("/dashboard")}
              className="text-zinc-600 hover:text-zinc-900"
            >
              My Dashboard
            </button>
            <a href="/api/auth/logout" className="text-zinc-600 hover:text-zinc-900">
              Logout
            </a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Admin</p>
            <h1 className="text-3xl font-semibold mt-1">Analytics Dashboard</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Platform usage for {email}. Chatbot metrics from Settings; site traffic from tracked events.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadStats()}
            className="self-start px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-500">
            Loading analytics…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats && !loading && (
          <div className="space-y-10">
            <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard label="Total users" value={stats.summary.totalUsers} hint="Settings accounts" />
              <StatCard label="Configured bots" value={stats.summary.configuredBots} hint="Have name or knowledge" />
              <StatCard label="Total questions" value={stats.summary.totalQuestions} hint="Across all chatbots" />
              <StatCard label="Active bots" value={stats.summary.botsWithActivity} hint="At least 1 question" />
              <StatCard label="Page views" value={stats.summary.pageViews} hint="Landing / tracked pages" />
              <StatCard label="CTA clicks" value={stats.summary.ctaClicks} hint="Login, demo, signup" />
            </section>

            {stats.summary.topChatbot && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Most-asked chatbot</h2>
                <p className="text-sm text-zinc-500 mt-1">Ranked by totalQuestions</p>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold">{stats.summary.topChatbot.businessName}</p>
                    <p className="text-sm text-zinc-500 mt-1">
                      {stats.summary.topChatbot.supportEmail || "No support email"} ·{" "}
                      <span className="font-mono text-xs">{stats.summary.topChatbot.ownerId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-semibold tabular-nums">
                      {stats.summary.topChatbot.totalQuestions}
                    </p>
                    <p className="text-xs text-zinc-500">questions · last {formatRelative(stats.summary.topChatbot.lastChatAt)}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-200">
                <h2 className="text-lg font-semibold">All chatbot users</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Sorted by questions asked. Each row is a Settings.ownerId business account.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[720px]">
                  <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Business</th>
                      <th className="px-4 py-3 font-medium">Support email</th>
                      <th className="px-4 py-3 font-medium">Owner ID</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium text-right">Questions</th>
                      <th className="px-4 py-3 font-medium">Last chat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                          No settings accounts yet.
                        </td>
                      </tr>
                    ) : (
                      stats.users.map((user, index) => (
                        <tr key={user.ownerId} className="border-t border-zinc-100 hover:bg-zinc-50/80">
                          <td className="px-4 py-3 text-zinc-400 tabular-nums">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">
                            {user.businessName}
                            {!user.configured && (
                              <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                Incomplete
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-zinc-600">{user.supportEmail || "—"}</td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-500 max-w-[140px] truncate" title={user.ownerId}>
                            {user.ownerId}
                          </td>
                          <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">{user.totalQuestions}</td>
                          <td className="px-4 py-3 text-zinc-600 whitespace-nowrap" title={formatDate(user.lastChatAt)}>
                            {formatRelative(user.lastChatAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Recent chat activity</h2>
                <p className="text-sm text-zinc-500 mt-1">Sorted by lastChatAt</p>
                <ul className="mt-4 space-y-3">
                  {stats.recentChatActivity.length === 0 ? (
                    <li className="text-sm text-zinc-500">No chatbot traffic yet.</li>
                  ) : (
                    stats.recentChatActivity.map((bot) => (
                      <li
                        key={bot.ownerId}
                        className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{bot.businessName}</p>
                          <p className="text-xs text-zinc-500 truncate">{bot.supportEmail || bot.ownerId}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold tabular-nums">{bot.totalQuestions} q</p>
                          <p className="text-xs text-zinc-500">{formatRelative(bot.lastChatAt)}</p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Site traffic events</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Lightweight page views & CTA clicks (not Google Analytics).
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
                    <p className="text-xs text-zinc-500">Page views</p>
                    <p className="text-2xl font-semibold mt-1">{stats.traffic.pageViews}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
                    <p className="text-xs text-zinc-500">CTA clicks</p>
                    <p className="text-2xl font-semibold mt-1">{stats.traffic.ctaClicks}</p>
                  </div>
                </div>
                {stats.traffic.topPaths.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium mb-2">Top paths</p>
                    <ul className="space-y-2">
                      {stats.traffic.topPaths.map((row) => (
                        <li key={row.path} className="flex justify-between text-sm">
                          <span className="font-mono text-xs text-zinc-600">{row.path}</span>
                          <span className="tabular-nums font-medium">{row.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium mb-2">Recent events</p>
                  <ul className="space-y-2 max-h-56 overflow-y-auto">
                    {stats.traffic.recentEvents.length === 0 ? (
                      <li className="text-sm text-zinc-500">No site events yet — visit the landing page once tracking is live.</li>
                    ) : (
                      stats.traffic.recentEvents.map((event, i) => (
                        <li key={`${event.createdAt}-${i}`} className="text-xs text-zinc-600 flex gap-2">
                          <span className="shrink-0 tabular-nums text-zinc-400 w-28">
                            {formatRelative(event.createdAt)}
                          </span>
                          <span className="font-medium text-zinc-800">{event.type}</span>
                          <span className="truncate">
                            {event.label || event.path}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
