"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
};

type Settings = {
  whatsappNumber?: string;
  deliveryFee?: number;
};

const CART_KEY = "lakida_cart";
const SETTINGS_KEY = "lakida_admin_settings";
const LAST_ORDER_KEY = "lakida_last_order";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as Settings) : {};
  } catch {
    return {};
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "delivery"
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [state, setState] = useState("Lagos");
  const [note, setNote] = useState("");

  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  useEffect(() => {
    const c = loadCart();
    setCart(c);
    setSettings(loadSettings());

    if (!c.length) {
      router.replace("/shop");
    }
  }, [router]);

  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
    [cart]
  );

  const deliveryFee = useMemo(() => {
    const fee = Number(settings?.deliveryFee) || 0;
    return deliveryMethod === "delivery" ? fee : 0;
  }, [settings, deliveryMethod]);

  const total = subtotal + deliveryFee;

  async function placeOrder() {
    setMsg(null);

    if (!fullName.trim() || !phone.trim()) {
      return setMsg({ type: "err", text: "Please enter Full Name and Phone." });
    }

    if (deliveryMethod === "delivery" && !address.trim()) {
      return setMsg({ type: "err", text: "Please enter your delivery address." });
    }

    setLoading(true);
    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        delivery: {
          method: deliveryMethod,
          address: deliveryMethod === "delivery" ? address.trim() : "",
          city: deliveryMethod === "delivery" ? city.trim() : "",
          state: deliveryMethod === "delivery" ? state.trim() : "",
          note: note.trim(),
        },
        items: cart.map((it) => ({
          productId: it.productId,
          title: it.title,
          price: it.price,
          qty: it.qty,
          size: it.size || "",
          color: it.color || "",
        })),
        subtotal,
        deliveryFee,
        total,
        status: "pending_whatsapp",
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Could not create order.");
      }

      const orderId = data?._id || data?.order?._id || "";
      const orderCode = data?.orderCode || data?.order?.orderCode || "";

      // store for success page whatsapp message
      localStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify({
          orderId,
          orderCode,
          payload,
          createdAt: new Date().toISOString(),
        })
      );

      router.push(`/success?orderCode=${encodeURIComponent(orderCode)}&id=${encodeURIComponent(orderId)}`);
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Checkout failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <Header />

      <section className="pt-24 pb-10 px-6 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
            Checkout
          </span>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold font-serif">
            Confirm Details
          </h1>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            You’ll confirm this order on WhatsApp after placing it.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6">
            <h2 className="text-xl font-bold font-serif">Customer Info</h2>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Field label="Full Name" value={fullName} onChange={setFullName} />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="0810..." />
              <Field label="Email (optional)" value={email} onChange={setEmail} type="email" />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold font-serif">Delivery</h3>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <Select
                  label="Delivery Method"
                  value={deliveryMethod}
                  onChange={(v) => setDeliveryMethod(v as any)}
                  options={[
                    { value: "delivery", label: "Delivery" },
                    { value: "pickup", label: "Pickup" },
                  ]}
                />

                {deliveryMethod === "delivery" ? (
                  <>
                    <Field label="City" value={city} onChange={setCity} />
                    <Field label="State" value={state} onChange={setState} />
                    <div className="md:col-span-2">
                      <Field label="Address" value={address} onChange={setAddress} />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 text-sm text-slate-600 dark:text-slate-300">
                    Pickup: We’ll share pickup details on WhatsApp.
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
                  Note (optional)
                </label>
                <textarea
                  className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special instruction..."
                />
              </div>
            </div>

            {msg ? (
              <div
                className={`mt-6 rounded-xl border p-4 text-sm ${
                  msg.type === "ok"
                    ? "border-green-500/30 bg-green-500/10 text-green-500"
                    : "border-red-500/30 bg-red-500/10 text-red-500"
                }`}
              >
                {msg.text}
              </div>
            ) : null}

            <div className="mt-8 flex gap-3">
              <button
                onClick={placeOrder}
                disabled={loading || !cart.length}
                className="bg-[#f2d00d] text-[#221f10] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Placing..." : "Place Order"}
              </button>

              <Link
                href="/cart"
                className="border border-[#f2d00d]/35 text-[#f2d00d] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#f2d00d]/10"
              >
                Back to Cart
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6 h-fit">
            <h2 className="text-xl font-bold font-serif">Order Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              {cart.map((it) => (
                <div key={it.productId} className="flex justify-between gap-3">
                  <div className="text-slate-700 dark:text-slate-200">
                    {it.title} <span className="text-slate-500">x{it.qty}</span>
                  </div>
                  <div className="font-semibold">{formatNaira(it.price * it.qty)}</div>
                </div>
              ))}

              <div className="h-px bg-[#f2d00d]/15 my-3" />

              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                <span className="font-semibold">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Delivery</span>
                <span className="font-semibold">{formatNaira(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2">
                <span>Total</span>
                <span className="text-[#f2d00d]">{formatNaira(total)}</span>
              </div>

              <p className="text-xs text-slate-500 pt-2">
                Delivery fee can be adjusted if location differs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-[#f2d00d]/20 bg-[#221f10]/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-[#f2d00d]">
        <span className="material-symbols-outlined text-3xl">diamond</span>
        <h2 className="text-xl font-bold tracking-widest font-serif uppercase">
          LA&apos;KIDA
        </h2>
      </Link>

      <Link
        href="/cart"
        className="border border-[#f2d00d]/35 text-[#f2d00d] px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#f2d00d]/10"
      >
        Cart
      </Link>
    </header>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg px-4 py-3"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#f8f8f5] dark:bg-[#221f10]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}