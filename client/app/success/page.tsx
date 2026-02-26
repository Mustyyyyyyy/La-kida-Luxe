
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const CART_KEY = "lakida_cart";
const LAST_ORDER_KEY = "lakida_last_order";
const SETTINGS_KEY = "lakida_admin_settings";

const FALLBACK_WA = "2347065630239";

function waLink(number: string, message: string) {
  const clean = (number || "").replace(/\s+/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

type Settings = { whatsappNumber?: string };

export default function SuccessPage() {
  const sp = useSearchParams();
  const orderCode = sp.get("orderCode") || "";
  const orderId = sp.get("id") || "";

  const [waNumber, setWaNumber] = useState(FALLBACK_WA);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify([]));
    } catch {}

    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const s = raw ? (JSON.parse(raw) as Settings) : {};
      if (s?.whatsappNumber) setWaNumber(s.whatsappNumber);
    } catch {}

    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY);
      setSummary(raw ? JSON.parse(raw) : null);
    } catch {
      setSummary(null);
    }
  }, []);

  const waMessage = useMemo(() => {
    const payload = summary?.payload;
    const customer = payload?.customer || {};
    const delivery = payload?.delivery || {};
    const items = payload?.items || [];
    const subtotal = payload?.subtotal || 0;
    const deliveryFee = payload?.deliveryFee || 0;
    const total = payload?.total || 0;

    const lines = [
      `Hi LA'KIDA, I just placed an order.`,
      orderCode ? `Order Code: ${orderCode}` : "",
      orderId ? `Order ID: ${orderId}` : "",
      "",
      `Customer: ${customer.fullName || ""}`,
      `Phone: ${customer.phone || ""}`,
      customer.email ? `Email: ${customer.email}` : "",
      "",
      `Items:`,
      ...items.map(
        (it: any) =>
          `- ${it.title} x${it.qty}${it.size ? ` (Size: ${it.size})` : ""}${
            it.color ? ` (Color: ${it.color})` : ""
          }`
      ),
      "",
      `Subtotal: ${subtotal}`,
      `Delivery: ${deliveryFee}`,
      `Total: ${total}`,
      "",
      `Delivery Method: ${delivery.method || "delivery"}`,
      delivery.address ? `Address: ${delivery.address}` : "",
      delivery.city ? `City: ${delivery.city}` : "",
      delivery.state ? `State: ${delivery.state}` : "",
      delivery.note ? `Note: ${delivery.note}` : "",
      "",
      `Please confirm this order. Thank you.`,
    ].filter(Boolean);

    return lines.join("\n");
  }, [summary, orderCode, orderId]);

  const waUrl = waLink(waNumber, waMessage);

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-[#f2d00d]/15 bg-white/70 dark:bg-[#221f10]/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[#f2d00d]">
          <span className="material-symbols-outlined text-3xl">diamond</span>
          <span className="text-xl font-bold tracking-widest font-serif uppercase">
            LA&apos;KIDA
          </span>
        </Link>

        <Link
          href="/shop"
          className="border border-[#f2d00d]/35 text-[#f2d00d] px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#f2d00d]/10"
        >
          Shop
        </Link>
      </header>

      <section className="px-6 lg:px-20 py-16">
        <div className="max-w-[900px] mx-auto rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-8 md:p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#f2d00d]/15 flex items-center justify-center text-[#f2d00d]">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>

          <h1 className="mt-5 text-3xl md:text-5xl font-bold font-serif">
            Order Created
          </h1>

          <p className="mt-3 text-slate-700 dark:text-slate-300">
            Your order has been created successfully. Next step: confirm on WhatsApp.
          </p>

          {orderCode ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#f2d00d]/25 bg-[#f2d00d]/10 px-5 py-2 text-sm font-bold text-[#f2d00d]">
              Order Code: {orderCode}
            </div>
          ) : null}

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110"
            >
              Open WhatsApp
            </a>

            <Link
              href="/shop"
              className="border border-[#f2d00d]/35 text-[#f2d00d] py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#f2d00d]/10"
            >
              Continue Shopping
            </Link>
          </div>


        </div>
      </section>
    </main>
  );
}