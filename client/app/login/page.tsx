"use client";

import Image from "next/image";
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
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

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
        const text =
          data?.message || data?.errors?.[0]?.message || "Login failed.";
        setMsg({ type: "err", text });
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      const role = data?.user?.role;

      if (role === "admin") router.push("/admin");
      else router.push("/dashboard");

      setMsg({ type: "ok", text: "Logged in. Redirecting..." });
    } catch {
      setMsg({ type: "err", text: "Network error. Check backend + CORS." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 page">
      {/* Left - image */}
      <section className="relative hidden lg:block">
        <Image src={BG} alt="Dress background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <BrandLogo className="text-[color:var(--accent)]" />

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

      {/* Right - form */}
      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <BrandLogo />
          </div>

          <div className="mt-6 card p-8 shadow-xl">
            <h2 className="text-2xl font-bold font-serif">Login</h2>
            <p className="mt-2 text-sm muted">Enter your details to continue.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@email.com"
                disabled={loading}
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                disabled={loading}
              />

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm disabled:opacity-60">
                {loading ? "Logging in..." : "Login"}
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

              <p className="text-sm muted">
                Don’t have an account?{" "}
                <Link href="/register" className="text-[color:var(--accent)] font-bold hover:underline">
                  Create one
                </Link>
              </p>

              <p className="text-xs muted">
                Admin accounts are created by the store owner (seed script), not via public signup.
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
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
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
        disabled={!!disabled}
        className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(242,208,13,0.20)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgba(242,208,13,0.25)]"
      />
    </div>
  );
}