"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

export const dynamic = "force-dynamic"; // ✅ stops static prerender errors on Vercel

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
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessInner />
    </Suspense>
  );
}

function SuccessInner() {
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
    <main className="page">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(20,0,31,0.78)] backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
        <BrandLogo size={56} />
        <Link href="/shop" className="btn-outline px-5 py-2 text-xs">
          Shop
        </Link>
      </header>

      <section className="px-6 lg:px-20 py-16">
        <div className="max-w-[900px] mx-auto card p-8 md:p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-[rgba(242,208,13,0.12)] flex items-center justify-center text-[color:var(--accent)]">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>

          <h1 className="mt-5 text-3xl md:text-5xl font-bold font-serif">
            Order Created
          </h1>

          <p className="mt-3 muted">
            Your order has been created successfully. Next step: confirm on WhatsApp.
          </p>

          {orderCode ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(242,208,13,0.25)] bg-[rgba(242,208,13,0.10)] px-5 py-2 text-sm font-bold text-[color:var(--accent)]">
              Order Code: {orderCode}
            </div>
          ) : null}

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary py-4 text-sm"
            >
              Open WhatsApp
            </a>

            <Link href="/shop" className="btn-outline py-4 text-sm text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SuccessSkeleton() {
  return (
    <main className="page">
      <div className="px-6 lg:px-20 py-16">
        <div className="max-w-[900px] mx-auto card p-10 text-center">
          <div className="text-sm muted">Loading success page…</div>
        </div>
      </div>
    </main>
  );
}