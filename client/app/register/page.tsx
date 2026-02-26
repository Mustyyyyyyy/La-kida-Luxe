"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BG =
  "https://images.unsplash.com/photo-1520975958225-2f8b39f0f3e5?auto=format&fit=crop&w=1600&q=80";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!fullName.trim() || !email.trim() || password.trim().length < 6) {
      return setMsg({
        type: "err",
        text: "Enter your name, a valid email, and a password (min 6).",
      });
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const text =
          data?.message || data?.errors?.[0]?.message || "Registration failed.";
        setMsg({ type: "err", text });
        return;
      }

      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const loginData = await loginRes.json().catch(() => ({}));

      if (loginRes.ok && loginData?.token) {
        localStorage.setItem("token", loginData.token);
        if (loginData?.user)
          localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      setMsg({ type: "ok", text: "Account created. Redirecting..." });
      router.push("/");
    } catch {
      setMsg({ type: "err", text: "Network error. Check backend + CORS." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 page">
      {/* Left image */}
      <section className="relative hidden lg:block">
        <Image
          src={BG}
          alt="Dress background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <BrandLogo />

          <div className="max-w-md">
            <h1 className="text-white text-5xl font-bold font-serif leading-tight">
              Join LA&apos;KIDA.
            </h1>
            <p className="mt-4 text-white/80 text-lg">
              Create your customer account to shop new arrivals and request bespoke tailoring.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
                New arrivals
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
                Custom orders
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
                Exclusive updates
              </span>
            </div>
          </div>

          <p className="text-white/50 text-xs tracking-[0.2em] uppercase">
            Luxury couture made personal
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <BrandLogo />
          </div>

          <div className="mt-6 card p-8 shadow-xl">
            <h2 className="text-2xl font-bold font-serif">Create Account</h2>
            <p className="mt-2 text-sm muted">This creates a customer account.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <Field
                label="Full Name"
                value={fullName}
                onChange={setFullName}
                placeholder="Your name"
                disabled={loading}
              />
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
                placeholder="Minimum 6 characters"
                disabled={loading}
              />

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm disabled:opacity-60">
                {loading ? "Creating..." : "Create Account"}
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
                Already have an account?{" "}
                <Link href="/login" className="text-[color:var(--accent)] font-bold hover:underline">
                  Login
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