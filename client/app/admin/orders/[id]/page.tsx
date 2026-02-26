"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetchAuth } from "@/lib/adminApi";

type Order = {
  _id: string;
  orderCode: string;
  status:
    | "pending_whatsapp"
    | "confirmed"
    | "in_progress"
    | "ready"
    | "delivered"
    | "cancelled";
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  createdAt: string;
  customer?: { fullName?: string; phone?: string; email?: string };
  delivery?: { address?: string; city?: string; state?: string; method?: string };
  items?: { title: string; price: number; qty: number; size?: string; color?: string }[];
  isCustom?: boolean;
  custom?: {
    styleType?: string;
    fabric?: string;
    specialInstructions?: string;
    measurements?: Record<string, string>;
    referenceImages?: string[];
  };
};

const STATUSES: Order["status"][] = [
  "pending_whatsapp",
  "confirmed",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
];

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function AdminOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!id) return;
    try {
      setLoading(true);
      setErr("");
      const all = await apiFetchAuth<Order[]>("/api/orders", { method: "GET" });
      const found = all.find((o) => o._id === id) || null;
      setOrder(found);
      if (!found) setErr("Order not found.");
    } catch (e: any) {
      setErr(e?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function updateStatus(status: Order["status"]) {
    if (!order) return;
    try {
      setBusy(true);
      const updated = await apiFetchAuth<Order>(`/api/orders/${order._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrder(updated);
    } catch (e: any) {
      alert(e?.message || "Status update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Order Details</h1>
          <p className="mt-2 text-sm muted">View customer info, items and update status.</p>
        </div>

        <Link href="/admin/orders" className="btn-outline px-4 py-2 text-xs">
          Back
        </Link>
      </div>

      {loading ? (
        <div className="card p-8 text-sm muted">Loading...</div>
      ) : err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {err}
        </div>
      ) : order ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] muted">Order</div>
                <div className="text-2xl font-bold font-serif">{order.orderCode}</div>
              </div>

              <span className="badge">{order.status}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Customer" value={order.customer?.fullName || "—"} />
              <Info label="Phone" value={order.customer?.phone || "—"} />
              <Info label="Email" value={order.customer?.email || "—"} />
              <Info label="Date" value={new Date(order.createdAt).toLocaleString()} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Delivery Method" value={order.delivery?.method || "standard"} />
              <Info
                label="Address"
                value={
                  order.delivery?.address
                    ? `${order.delivery.address}${
                        order.delivery.city ? `, ${order.delivery.city}` : ""
                      }${order.delivery.state ? `, ${order.delivery.state}` : ""}`
                    : "—"
                }
              />
            </div>

            <div className="pt-2">
              <div className="text-xs uppercase tracking-[0.2em] muted">Update status</div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value as Order["status"])}
                disabled={busy}
                className="mt-2 w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(242,208,13,0.20)] rounded-lg px-3 py-3 text-white disabled:opacity-60"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#14001f]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold font-serif">Items / Custom</h2>

            {order.isCustom ? (
              <div className="mt-4 space-y-3 text-sm">
                <Info label="Custom" value="Yes" />
                <Info label="Style Type" value={order.custom?.styleType || "—"} />
                <Info label="Fabric" value={order.custom?.fabric || "—"} />
                <Info label="Instructions" value={order.custom?.specialInstructions || "—"} />

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.2em] muted">
                    Measurements
                  </div>
                  <div className="mt-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 text-sm">
                    {order.custom?.measurements
                      ? Object.entries(order.custom.measurements).map(([k, v]) => (
                          <div key={k} className="flex justify-between py-1">
                            <span className="muted">{k}</span>
                            <span className="font-semibold">{v}</span>
                          </div>
                        ))
                      : "—"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {(order.items || []).map((it, idx) => (
                  <div key={idx} className="card-soft p-4">
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-xs muted mt-1">
                      Qty: {it.qty} • {it.size ? `Size: ${it.size}` : "Size: —"} •{" "}
                      {it.color ? `Color: ${it.color}` : "Color: —"}
                    </div>
                    <div className="mt-2 font-bold text-[color:var(--accent)]">
                      {formatNaira(it.price)}
                    </div>
                  </div>
                ))}

                {(order.items || []).length === 0 ? (
                  <div className="text-sm muted">No items on this order.</div>
                ) : null}
              </div>
            )}

            <div className="mt-6 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
              <div className="flex justify-between text-sm">
                <span className="muted">Subtotal</span>
                <span className="font-semibold">{formatNaira(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="muted">Delivery</span>
                <span className="font-semibold">{formatNaira(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between mt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-[color:var(--accent)]">{formatNaira(order.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-soft p-4">
      <div className="text-xs uppercase tracking-[0.2em] muted">{label}</div>
      <div className="mt-1 font-semibold text-white/90">{value}</div>
    </div>
  );
}