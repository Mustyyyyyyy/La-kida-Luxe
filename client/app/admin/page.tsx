"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetchAuth, getApiUrl } from "@/lib/adminApi";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  images?: { url: string; publicId: string }[];
};

type Order = {
  _id: string;
  orderCode: string;
  status:
    | "pending_whatsapp"
    | "confirmed"
    | "in_progress"
    | "ready"
    | "delivered"
    | "cancelled"
    | string;
  total: number;
  createdAt: string;
  customer?: { fullName?: string; phone?: string; email?: string };
};

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function niceStatus(s: string) {
  const map: Record<string, string> = {
    pending_whatsapp: "Pending WhatsApp",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[s] || s;
}

export default function AdminHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setErr("");

        // Products = public endpoint
        const p = await fetch(`${getApiUrl()}/api/products`, {
          cache: "no-store",
        }).then((r) => r.json());

        // Orders = admin protected
        const o = await apiFetchAuth<Order[]>("/api/orders", { method: "GET" });

        if (!mounted) return;

        setProducts(Array.isArray(p) ? p : []);
        setOrders(Array.isArray(o) ? o : []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;

    const pending = orders.filter((x) => x.status === "pending_whatsapp").length;
    const inProgress = orders.filter((x) => x.status === "in_progress").length;

    const revenue = orders
      .filter((x) => x.status !== "cancelled")
      .reduce((sum, x) => sum + (x.total || 0), 0);

    const latestOrders = [...orders]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 8);

    return { totalProducts, totalOrders, pending, inProgress, revenue, latestOrders };
  }, [products, orders]);

  return (
    <main className="page">
      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif">Dashboard</h1>
              <p className="mt-2 text-sm muted">Quick overview of products and orders.</p>
            </div>

            <div className="flex gap-3">
              <Link href="/admin/products/new" className="btn-primary px-4 py-2 text-xs hover:brightness-110">
                Add Product
              </Link>
              <Link href="/admin/orders" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
                View Orders
              </Link>
              <Link href="/admin/messages" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
                Messages
              </Link>
            </div>
          </div>

          {err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Products" value={loading ? "—" : String(stats.totalProducts)} icon="checkroom" />
            <StatCard title="Orders" value={loading ? "—" : String(stats.totalOrders)} icon="receipt_long" />
            <StatCard title="Pending WhatsApp" value={loading ? "—" : String(stats.pending)} icon="hourglass_empty" />
            <StatCard title="In Progress" value={loading ? "—" : String(stats.inProgress)} icon="construction" />
            <StatCard title="Revenue" value={loading ? "—" : formatNaira(stats.revenue)} icon="payments" />
          </div>

          {/* Latest Orders */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif">Latest Orders</h2>
              <Link href="/admin/orders" className="text-sm font-bold text-[color:var(--accent)] hover:underline">
                See all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm">
                <thead className="muted">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-6">Order</th>
                    <th className="text-left py-3 px-6">Customer</th>
                    <th className="text-left py-3 px-6">Status</th>
                    <th className="text-left py-3 px-6">Total</th>
                    <th className="text-left py-3 px-6">Date</th>
                    <th className="text-left py-3 px-6">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 muted">
                        Loading...
                      </td>
                    </tr>
                  ) : stats.latestOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 muted">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    stats.latestOrders.map((o) => (
                      <tr key={o._id} className="border-b border-white/10">
                        <td className="py-3 px-6 font-semibold">{o.orderCode}</td>
                        <td className="py-3 px-6">
                          <div className="font-semibold">{o.customer?.fullName || "—"}</div>
                          <div className="text-xs muted">
                            {o.customer?.phone || ""} {o.customer?.email ? `• ${o.customer.email}` : ""}
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <span className="badge">{niceStatus(o.status)}</span>
                        </td>
                        <td className="py-3 px-6 font-semibold text-[color:var(--accent)]">
                          {formatNaira(o.total)}
                        </td>
                        <td className="py-3 px-6 muted">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="py-3 px-6">
                          <Link
                            href={`/admin/orders/${o._id}`}
                            className="btn-outline px-3 py-2 text-[10px] hover:bg-white/10"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <QuickLink
              title="Manage Products"
              desc="Add new items, update prices, images and stock."
              href="/admin/products"
              icon="checkroom"
            />
            <QuickLink
              title="Manage Orders"
              desc="Track WhatsApp orders and update delivery status."
              href="/admin/orders"
              icon="receipt_long"
            />
            <QuickLink
              title="Customer Messages"
              desc="Read contact form messages and mark replied/closed."
              href="/admin/messages"
              icon="chat"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] muted">{title}</div>
          <div className="mt-2 text-3xl font-bold font-serif">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--accent)]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href} className="card p-6 hover:bg-white/10 transition">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--accent)]">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold font-serif">{title}</h3>
      <p className="mt-2 text-sm muted">{desc}</p>
      <div className="mt-4 text-sm font-bold text-[color:var(--accent)]">Open →</div>
    </Link>
  );
}