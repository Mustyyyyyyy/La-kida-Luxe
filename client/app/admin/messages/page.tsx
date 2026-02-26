"use client";

import { useEffect, useState } from "react";
import { apiFetchAuth } from "@/lib/adminApi";

type ContactMsg = {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  message: string;
  status: "new" | "replied" | "closed";
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await apiFetchAuth<ContactMsg[]>("/api/contact", { method: "GET" });
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: ContactMsg["status"]) {
    try {
      setBusyId(id);
      const updated = await apiFetchAuth<ContactMsg>(`/api/contact/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setItems((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (e: any) {
      alert(e?.message || "Status update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Messages</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Customer contact submissions. Mark as replied or closed.
          </p>
        </div>

        <button
          onClick={load}
          className="border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
        >
          Refresh
        </button>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-500">
          {err}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="text-slate-600 dark:text-slate-300">
              <tr className="border-b border-[#f2d00d]/15">
                <th className="text-left py-3 px-5">Customer</th>
                <th className="text-left py-3 px-5">Message</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Actions</th>
                <th className="text-left py-3 px-5">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 px-5 text-slate-600 dark:text-slate-300">
                    Loading messages...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-5 text-slate-600 dark:text-slate-300">
                    No messages yet.
                  </td>
                </tr>
              ) : (
                items.map((m) => (
                  <tr key={m._id} className="border-b border-[#f2d00d]/10 align-top">
                    <td className="py-3 px-5">
                      <div className="font-semibold">{m.fullName}</div>
                      <div className="text-xs text-slate-500">
                        {m.phone || ""} {m.email ? `• ${m.email}` : ""}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ID: {m._id.slice(-6)}
                      </div>
                    </td>

                    <td className="py-3 px-5">
                      <div className="text-slate-800 dark:text-slate-100">
                        {m.message}
                      </div>
                    </td>

                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#f2d00d]/25 bg-[#f2d00d]/10 text-[#f2d00d]">
                        {m.status}
                      </span>
                    </td>

                    <td className="py-3 px-5">
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === m._id}
                          onClick={() => setStatus(m._id, "replied")}
                          className="border border-[#f2d00d]/35 text-[#f2d00d] px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-[#f2d00d]/10 disabled:opacity-60"
                        >
                          {busyId === m._id ? "..." : "Mark Replied"}
                        </button>
                        <button
                          disabled={busyId === m._id}
                          onClick={() => setStatus(m._id, "closed")}
                          className="border border-slate-400/35 text-slate-600 dark:text-slate-200 px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 disabled:opacity-60"
                        >
                          {busyId === m._id ? "..." : "Close"}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-slate-600 dark:text-slate-300">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}