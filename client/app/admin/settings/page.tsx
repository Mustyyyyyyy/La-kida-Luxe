"use client";

import { useEffect, useState } from "react";

type Settings = {
  brandName: string;
  whatsappNumber: string; 
  businessEmail: string;
  location: string;
  deliveryFee: number;
};

const KEY = "lakida_admin_settings";

const DEFAULTS: Settings = {
  brandName: "LA'KIDA",
  whatsappNumber: "2347065630239",
  businessEmail: "lakida@yourbrand.com",
  location: "Lagos, Nigeria",
  deliveryFee: 0,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) });
    } catch {
    }
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);

    try {
      const cleaned: Settings = {
        brandName: settings.brandName.trim() || DEFAULTS.brandName,
        whatsappNumber: settings.whatsappNumber.replace(/\s+/g, ""),
        businessEmail: settings.businessEmail.trim(),
        location: settings.location.trim(),
        deliveryFee: Number(settings.deliveryFee) || 0,
      };

      localStorage.setItem(KEY, JSON.stringify(cleaned));
      setSettings(cleaned);
      setMsg({ type: "ok", text: "Settings saved." });
    } catch {
      setMsg({ type: "err", text: "Could not save settings." });
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
    setSettings(DEFAULTS);
    setMsg({ type: "ok", text: "Reset to defaults." });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif">Settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Store-wide info used for WhatsApp checkout and contact details.
        </p>
      </div>

      {msg ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            msg.type === "ok"
              ? "border-green-500/30 bg-green-500/10 text-green-500"
              : "border-red-500/30 bg-red-500/10 text-red-500"
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6 max-w-2xl">
        <div className="grid gap-5">
          <Field
            label="Brand name"
            value={settings.brandName}
            onChange={(v) => update("brandName", v)}
            placeholder="LA'KIDA"
          />
          <Field
            label="WhatsApp number (international format)"
            value={settings.whatsappNumber}
            onChange={(v) => update("whatsappNumber", v)}
            placeholder="2348109115088"
          />
          <Field
            label="Business email"
            value={settings.businessEmail}
            onChange={(v) => update("businessEmail", v)}
            placeholder="lakida@yourbrand.com"
          />
          <Field
            label="Location"
            value={settings.location}
            onChange={(v) => update("location", v)}
            placeholder="Lagos, Nigeria"
          />
          <NumberField
            label="Default delivery fee (NGN)"
            value={settings.deliveryFee}
            onChange={(n) => update("deliveryFee", n)}
          />

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={reset}
              className="border border-[#f2d00d]/35 text-[#f2d00d] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#f2d00d]/10"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-slate-500">
            These settings are saved in the admin browser (localStorage). If you want them saved in MongoDB for all admins/devices, tell me and I’ll add the backend endpoints.
          </p>
        </div>
      </div>
    </div>
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
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        type="number"
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}