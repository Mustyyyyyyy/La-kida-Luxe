"use client";

import { useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function StockNotifyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function subscribe() {
    setMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stock-alerts/${productId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Could not subscribe");

      setMsg(data?.message || "Saved! We’ll email you when it’s back.");
    } catch (e: any) {
      setMsg(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={subscribe}
        disabled={loading}
        className="btn-outline w-full py-4 text-sm hover:bg-white/10 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Notify me when back in stock"}
      </button>

      {msg ? <p className="text-xs muted">{msg}</p> : null}
    </div>
  );
}