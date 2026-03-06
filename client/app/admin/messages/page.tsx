"use client";

import { useEffect, useState } from "react";
import { apiFetchAuth } from "@/lib/adminApi";

type Msg = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
};

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyClear, setBusyClear] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await apiFetchAuth<Msg[]>("/api/contact", { method: "GET" });
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

  async function onDelete(id: string) {
    if (!confirm("Delete this message?")) return;

    try {
      setBusyId(id);
      await apiFetchAuth(`/api/contact/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((m) => m._id !== id));
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function clearAll() {
    if (!confirm("Delete ALL messages?")) return;

    try {
      setBusyClear(true);
      await apiFetchAuth(`/api/contact`, { method: "DELETE" });
      setItems([]);
    } catch (e: any) {
      alert(e?.message || "Clear failed");
    } finally {
      setBusyClear(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-white">
            Messages
          </h1>
          <p className="mt-2 text-sm font-bold text-white/80">
            Customer contact messages.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={load} className="btn-outline px-4 py-2 text-xs hover:bg-white/10" type="button">
            Refresh
          </button>

          <button
            onClick={clearAll}
            disabled={busyClear || items.length === 0}
            className="btn-primary px-4 py-2 text-xs disabled:opacity-60"
            type="button"
          >
            {busyClear ? "Clearing..." : "Clear all"}
          </button>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm font-bold text-red-200">
          {err}
        </div>
      ) : null}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm font-bold text-white/80">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-white/80 font-bold">No messages yet.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {items.map((m) => (
              <div key={m._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-extrabold text-white truncate">
                      {m.subject || "Message"}
                    </div>
                    <div className="text-sm font-bold text-white/80">
                      {m.name || "—"} • {m.email || "—"} {m.phone ? `• ${m.phone}` : ""}
                    </div>
                    {m.createdAt ? (
                      <div className="text-xs font-bold text-white/60 mt-1">
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button" 
                    onClick={() => onDelete(m._id)}
                    disabled={busyId === m._id}
                    className="border border-red-500/35 text-white bg-red-600/25 px-3 py-2 rounded-lg font-extrabold uppercase tracking-widest text-[10px] hover:bg-red-600/35 disabled:opacity-60"
                  >
                    {busyId === m._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div className="mt-3 text-sm font-bold text-white/85 whitespace-pre-wrap">
                  {m.message || "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}