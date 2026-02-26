"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!fullName.trim() || message.trim().length < 5) {
      return setMsg({ type: "err", text: "Enter your name and a message." });
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const text =
          data?.message || data?.errors?.[0]?.message || "Could not send message.";
        setMsg({ type: "err", text });
      } else {
        setMsg({ type: "ok", text: data?.message || "Message sent!" });
        setFullName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (err) {
      setMsg({ type: "err", text: "Network error. Is your backend running?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <Field label="Full Name" value={fullName} onChange={setFullName} disabled={loading} />
      <Field label="Email" type="email" value={email} onChange={setEmail} disabled={loading} />
      <Field label="Phone" value={phone} onChange={setPhone} disabled={loading} />

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
          Message
        </label>
        <textarea
          className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(242,208,13,0.20)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgba(242,208,13,0.25)]"
          rows={5}
          placeholder="Tell us what you need..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm disabled:opacity-60">
        {loading ? "Sending..." : "Send Message"}
      </button>

      {msg ? (
        <div
          className={`rounded-xl border px-4 py-3 text-xs ${
            msg.type === "ok"
              ? "border-green-500/30 bg-green-500/10 text-green-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(242,208,13,0.20)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgba(242,208,13,0.25)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!!disabled}
      />
    </div>
  );
}