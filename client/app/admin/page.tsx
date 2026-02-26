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
  status: string;
  total: number;
  createdAt: string;
  customer?: { fullName?: string; phone?: string };
};

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function AdminDashboardPage() {
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

        // products is public in your backend, orders is admin-protected
        const [p, o] = await Promise.all([
          fetch(`${getApiUrl()}/api/products`, { cache: "no-store" }).then((r) =>
            r.json()
          ),
          apiFetchAuth<Order[]>("/api/orders"),
        ]);

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

    const latestOrders = [...orders].slice(0, 6);

    return { totalProducts, totalOrders, pending, inProgress, latestOrders };
  }, [products, orders]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Quick overview of products and orders.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
          >
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
          >
            View Orders
          </Link>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-500">
          {err}
        </div>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Products"
          value={loading ? "—" : String(stats.totalProducts)}
          icon="checkroom"
        />
        <StatCard
          title="Orders"
          value={loading ? "—" : String(stats.totalOrders)}
          icon="receipt_long"
        />
        <StatCard
          title="Pending WhatsApp"
          value={loading ? "—" : String(stats.pending)}
          icon="hourglass_empty"
        />
        <StatCard
          title="In Progress"
          value={loading ? "—" : String(stats.inProgress)}
          icon="construction"
        />
      </div>

      <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-serif">Latest Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-[#f2d00d] hover:underline"
          >
            See all →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="text-slate-600 dark:text-slate-300">
              <tr className="border-b border-[#f2d00d]/15">
                <th className="text-left py-3">Order</th>
                <th className="text-left py-3">Customer</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Total</th>
                <th className="text-left py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? [] : stats.latestOrders).map((o) => (
                <tr key={o._id} className="border-b border-[#f2d00d]/10">
                  <td className="py-3 font-semibold">{o.orderCode}</td>
                  <td className="py-3">
                    {o.customer?.fullName || "—"}{" "}
                    <span className="text-slate-500">
                      {o.customer?.phone ? `(${o.customer.phone})` : ""}
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge status={o.status} />
                  </td>
                  <td className="py-3 font-semibold">{formatNaira(o.total)}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {!loading && stats.latestOrders.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-600 dark:text-slate-300" colSpan={5}>
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
    <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {title}
          </div>
          <div className="mt-2 text-3xl font-bold font-serif">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#f2d00d]/15 flex items-center justify-center text-[#f2d00d]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending_whatsapp: "Pending",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#f2d00d]/25 bg-[#f2d00d]/10 text-[#f2d00d]">
      {map[status] || status}
    </span>
  );
}