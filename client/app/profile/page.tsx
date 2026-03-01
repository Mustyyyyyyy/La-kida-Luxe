"use client";

import { useEffect, useState } from "react";
import CustomerHeader from "@/components/CustomerHeader";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

type Me = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
};

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function loadMe() {
    setMsg(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to load profile");

      setMe(data);
      setFullName(data.fullName || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Could not load profile" });
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setMsg(null);
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/api/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Update failed");

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMe(data.user);
      }

      setMsg({ type: "ok", text: "Profile updated ✅" });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  return (
    <main className="page">
      <CustomerHeader />

      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[900px] mx-auto card p-7 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-white">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-white/80 font-semibold">
            Update your name, phone and address.
          </p>

          {loading ? (
            <div className="mt-6 text-white/80 text-sm font-semibold">Loading...</div>
          ) : (
            <div className="mt-6 grid gap-4">
              <Field label="Full Name" value={fullName} onChange={setFullName} />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="0810..." />
              <Field
                label="Address"
                value={address}
                onChange={setAddress}
                placeholder="Street, area, city"
              />

              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  onClick={save}
                  disabled={saving}
                  className="btn-primary px-6 py-3 text-sm disabled:opacity-60"
                  type="button"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={loadMe}
                  className="btn-outline px-6 py-3 text-sm hover:bg-white/10"
                  type="button"
                >
                  Refresh
                </button>
              </div>

              {msg ? (
                <div
                  className={`mt-3 rounded-xl border p-4 text-sm font-semibold ${
                    msg.type === "ok"
                      ? "border-green-500/30 bg-green-500/10 text-green-200"
                      : "border-red-500/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {msg.text}
                </div>
              ) : null}

              {me?.email ? (
                <div className="mt-4 text-xs text-white/80 font-semibold">
                  Logged in as: <span className="text-white font-bold">{me.email}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-white">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input font-semibold"
      />
    </div>
  );
}