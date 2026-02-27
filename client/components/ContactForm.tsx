"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const clean = email.trim().toLowerCase();
    if (!clean) return setMsg({ type: "err", text: "Please enter your email." });

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const text = data?.message || data?.errors?.[0]?.message || "Could not subscribe.";
        setMsg({ type: "err", text });
      } else {
        setMsg({ type: "ok", text: data?.message || "Subscribed!" });
        setEmail("");
      }
    } catch {
      setMsg({ type: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        className="input"
        placeholder="Your Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading} className="btn-primary py-3 text-sm hover:brightness-110 disabled:opacity-60">
        {loading ? "Subscribing..." : "Subscribe"}
      </button>

      {msg ? (
        <p className={`text-xs mt-1 ${msg.type === "ok" ? "text-green-300" : "text-red-300"}`}>
          {msg.text}
        </p>
      ) : null}
    </form>
  );
}