"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      // Register customer
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

      // Auto-login to get JWT
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
        if (loginData?.user) localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      setMsg({ type: "ok", text: "Account created. Redirecting..." });
      router.push("/"); // customer goes home
    } catch {
      setMsg({ type: "err", text: "Network error. Check backend + CORS." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#f8f8f5] dark:bg-[#221f10]">
      {/* LEFT */}
      <section className="relative hidden lg:block">
        <Image src={BG} alt="Dress background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[#f2d00d]">
            <span className="material-symbols-outlined text-3xl">diamond</span>
            <span className="text-2xl font-bold tracking-widest font-serif uppercase">
              LA&apos;KIDA
            </span>
          </Link>

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

      {/* RIGHT */}
      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-[#f2d00d]">
            <span className="material-symbols-outlined text-3xl">diamond</span>
            <span className="text-xl font-bold tracking-widest font-serif uppercase">
              LA&apos;KIDA
            </span>
          </Link>

          <div className="mt-6 rounded-2xl border border-[#f2d00d]/20 bg-white/70 dark:bg-white/5 p-8 shadow-xl">
            <h2 className="text-2xl font-bold font-serif">Create Account</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This creates a customer account.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="Your name" />
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 6 characters" />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              {msg ? (
                <p className={`text-xs ${msg.type === "ok" ? "text-green-500" : "text-red-500"}`}>
                  {msg.text}
                </p>
              ) : null}

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#f2d00d] font-bold hover:underline">
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
      />
    </div>
  );
}