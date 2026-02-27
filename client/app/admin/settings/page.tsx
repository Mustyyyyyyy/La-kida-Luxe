"use client";

import { useEffect, useState } from "react";

type Settings = {
  brandName: string;
  whatsappNumber: string;
  businessEmail: string;
  location: string;
  deliveryFee: number;

  bankName: string;
  accountName: string;
  accountNumber: string;
};

const KEY = "lakida_admin_settings";

const DEFAULTS: Settings = {
  brandName: "LA'KIDA",
  whatsappNumber: "2347065630239",
  businessEmail: "lakida@yourbrand.com",
  location: "Lagos, Nigeria",
  deliveryFee: 0,

  bankName: "",
  accountName: "",
  accountNumber: "",
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
    } catch {}
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

        bankName: settings.bankName.trim(),
        accountName: settings.accountName.trim(),
        accountNumber: settings.accountNumber.replace(/\s+/g, ""),
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
        <p className="mt-2 text-sm muted">
          These settings control WhatsApp checkout and payment details.
        </p>
      </div>

      {msg ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            msg.type === "ok"
              ? "border-green-500/30 bg-green-500/10 text-green-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      <div className="card p-6 max-w-2xl">
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

          <div className="h-px bg-white/10 my-2" />

          <div>
            <h2 className="text-lg font-bold font-serif">Payment Details</h2>
            <p className="mt-1 text-sm muted">
              Optional. If you set these, they’ll appear in the customer WhatsApp
              message after checkout.
            </p>
          </div>

          <Field
            label="Bank name"
            value={settings.bankName}
            onChange={(v) => update("bankName", v)}
            placeholder="e.g. Access Bank"
          />

          <Field
            label="Account name"
            value={settings.accountName}
            onChange={(v) => update("accountName", v)}
            placeholder="e.g. LA'KIDA Couture"
          />

          <Field
            label="Account number"
            value={settings.accountNumber}
            onChange={(v) => update("accountNumber", v)}
            placeholder="e.g. 0123456789"
          />

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="btn-primary py-4 text-sm hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={reset}
              className="btn-outline py-4 text-sm hover:bg-white/10"
            >
              Reset
            </button>
          </div>

          <p className="text-xs muted">
            Tip: use WhatsApp number like <b>234810...</b> (no + sign, no spaces).
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
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
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
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <input
        type="number"
        className="input"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}