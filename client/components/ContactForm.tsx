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
      <Field label="Full Name" value={fullName} onChange={setFullName} />
      <Field label="Email" type="email" value={email} onChange={setEmail} />
      <Field label="Phone" value={phone} onChange={setPhone} />

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
          Message
        </label>
        <textarea
          className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
          rows={5}
          placeholder="Tell us what you need..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {msg ? (
        <p className={`text-xs ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>
          {msg.text}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={false}
      />
    </div>
  );
}