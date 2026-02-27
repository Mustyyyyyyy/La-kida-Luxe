"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BG =
  "https://images.unsplash.com/photo-1520975958225-2f8b39f0f3e5?auto=format&fit=crop&w=1600&q=80";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!email.trim() || !password.trim()) {
      return setMsg({ type: "err", text: "Enter email and password." });
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const text = data?.message || data?.errors?.[0]?.message || "Login failed.";
        setMsg({ type: "err", text });
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      const role = data?.user?.role;
      if (role === "admin") router.push("/admin");
      else router.push("/");

      setMsg({ type: "ok", text: "Logged in. Redirecting..." });
    } catch {
      setMsg({ type: "err", text: "Network error. Check backend + CORS." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[color:var(--bg)]">
      <section className="relative hidden lg:block">
        <img src={BG} alt="Dress background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <BrandLogo size={70} />

          <div className="max-w-md">
            <h1 className="text-white text-5xl font-bold font-serif leading-tight">
              Welcome back.
            </h1>
            <p className="mt-4 text-white/80 text-lg">
              Login to shop, track requests, and get support for custom order.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
                Premium finishing
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
                Bespoke tailoring
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
                Delivery available
              </span>
            </div>
          </div>

          <p className="text-white/50 text-xs tracking-[0.2em] uppercase">
            High-end African fashion
          </p>
        </div>
      </section>

      <section className="page flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <BrandLogo size={60} />
          </div>

          <div className="mt-6 card p-8 shadow-xl">
            <h2 className="text-2xl font-bold font-serif">Login</h2>
            <p className="mt-2 text-sm muted2">Enter your details to continue.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm hover:brightness-110 disabled:opacity-60">
                {loading ? "Logging in..." : "Login"}
              </button>

              {msg ? (
                <p className={`text-xs ${msg.type === "ok" ? "text-green-300" : "text-red-300"}`}>
                  {msg.text}
                </p>
              ) : null}

              <p className="text-sm muted2">
                Don’t have an account?{" "}
                <Link href="/register" className="text-[color:var(--accent)] font-bold hover:underline">
                  Create one
                </Link>
                <Link href="/policies" className="ml-4 text-[color:var(--accent)] font-bold hover:underline">
                  Policies
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}