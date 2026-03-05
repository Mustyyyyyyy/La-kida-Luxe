"use client";

import { useEffect, useState } from "react";
import { apiFetchAuth } from "@/lib/adminApi";

type Msg = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

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

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Messages</h1>
          <p className="mt-2 text-sm muted">Customer inquiries from Contact form.</p>
        </div>

        <button onClick={load} className="btn-outline px-4 py-2 text-xs">
          Refresh
        </button>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      {loading ? (
        <div className="card p-8 text-sm muted">Loading messages...</div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="muted">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((m) => (
            <div key={m._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold">
                    {m.name || "Customer"}{" "}
                    <span className="text-xs muted">
                      • {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    {m.email || "—"} {m.phone ? `• ${m.phone}` : ""}
                  </div>
                </div>

                <button
                  onClick={() => onDelete(m._id)}
                  disabled={busyId === m._id}
                  className="btn-outline px-3 py-2 text-[10px] hover:bg-white/10 disabled:opacity-60"
                >
                  {busyId === m._id ? "Working..." : "Delete"}
                </button>
              </div>

              <div className="mt-4 text-sm text-white/90 whitespace-pre-wrap">
                {m.message || "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}