"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CustomerHeader from "@/components/CustomerHeader";

const CART_KEY = "lakida_cart";

type CartItem = { price: number; qty: number };

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // must be logged in
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setUser(rawUser ? JSON.parse(rawUser) : null);
    } catch {
      setUser(null);
    }

    // cart summary
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
      setCartCount(items.reduce((n, it) => n + (it.qty || 1), 0));
      setCartTotal(items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0));
    } catch {
      setCartCount(0);
      setCartTotal(0);
    }
  }, []);

  const name = useMemo(() => user?.fullName || "Customer", [user]);

  return (
    <main className="page">
      <CustomerHeader />

      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[1100px] mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif">
              Welcome, {name}
            </h1>
            <p className="mt-2 muted">
              Manage your profile, check your cart, and track your orders.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Profile" icon="person">
              <p className="text-sm muted">
                Update name, phone & address anytime.
              </p>
              <Link href="/profile" className="btn-outline mt-4 inline-flex px-4 py-2 text-xs hover:bg-white/10">
                Open Profile
              </Link>
            </Card>

            <Card title="Cart" icon="shopping_bag">
              <p className="text-sm muted">
                Items: <span className="font-semibold text-white">{cartCount}</span>
              </p>
              <p className="text-sm muted mt-1">
                Total: <span className="font-semibold text-[color:var(--accent)]">{formatNaira(cartTotal)}</span>
              </p>
              <div className="mt-4 flex gap-2">
                <Link href="/cart" className="btn-primary inline-flex px-4 py-2 text-xs hover:brightness-110">
                  View Cart
                </Link>
                <Link href="/shop" className="btn-outline inline-flex px-4 py-2 text-xs hover:bg-white/10">
                  Shop
                </Link>
              </div>
            </Card>

            <Card title="Orders" icon="receipt_long">
              <p className="text-sm muted">
                View your recent orders & statuses.
              </p>
              <Link href="/orders" className="btn-outline mt-4 inline-flex px-4 py-2 text-xs hover:bg-white/10">
                View Orders
              </Link>
            </Card>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold font-serif">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/custom-order" className="btn-primary px-6 py-3 text-sm hover:brightness-110">
                Request Custom Order
              </Link>
              <Link href="/contact" className="btn-outline px-6 py-3 text-sm hover:bg-white/10">
                Contact Support
              </Link>
              <Link href="/policies" className="btn-outline px-6 py-3 text-sm hover:bg-white/10">
                Policies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--accent)]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className="text-lg font-bold font-serif">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}