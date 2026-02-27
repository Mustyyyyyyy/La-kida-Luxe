"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import CustomerHeader from "@/components/CustomerHeader";

type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
};

const CART_KEY = "lakida_cart";

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

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
    [items]
  );

  function updateQty(productId: string, nextQty: number) {
    const qty = Math.max(1, nextQty);
    const next = items.map((it) =>
      it.productId === productId ? { ...it, qty } : it
    );
    setItems(next);
    saveCart(next);
  }

  function removeItem(productId: string) {
    const next = items.filter((it) => it.productId !== productId);
    setItems(next);
    saveCart(next);
  }

  function clearCart() {
    setItems([]);
    saveCart([]);
  }

  return (
    <main className="page">
      <CustomerHeader />

      <section className="pt-24 pb-10 px-6 lg:px-20">
        <div className="max-w-[1200px] mx-auto flex items-end justify-between gap-4">
          <div>
            <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">
              Cart
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold font-serif">
              Your Selections
            </h1>
          </div>

          {items.length > 0 ? (
            <button
              onClick={clearCart}
              className="border border-red-500/35 text-red-200 px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-red-500/10"
            >
              Clear
            </button>
          ) : null}
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="muted">Your cart is empty.</p>
                <Link href="/shop" className="inline-flex mt-5 btn-primary px-6 py-3 text-sm hover:brightness-110">
                  Go to Shop
                </Link>
              </div>
            ) : (
              items.map((it) => (
                <div key={it.productId} className="card p-5 flex gap-4">
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-black/20 flex-shrink-0 border border-white/10">
                    <img
                      src={it.image || "/placeholder-1.jpg"}
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold font-serif text-lg">{it.title}</div>
                        <div className="text-sm muted2">
                          {it.size ? `Size: ${it.size}` : "Size: —"} •{" "}
                          {it.color ? `Color: ${it.color}` : "Color: —"}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(it.productId)}
                        className="border border-red-500/35 text-red-200 px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="font-bold text-[color:var(--accent)]">
                        {formatNaira(it.price)}
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => updateQty(it.productId, it.qty - 1)}
                          className="w-10 h-10 rounded-lg border border-white/15 hover:bg-white/10 font-bold"
                        >
                          −
                        </button>
                        <div className="w-12 text-center font-bold">{it.qty}</div>
                        <button
                          onClick={() => updateQty(it.productId, it.qty + 1)}
                          className="w-10 h-10 rounded-lg border border-white/15 hover:bg-white/10 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit">
            <h2 className="text-xl font-bold font-serif">Summary</h2>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="muted2">Subtotal</span>
                <span className="font-semibold">{formatNaira(subtotal)}</span>
              </div>
              <div className="text-xs text-white/55">
                Delivery fee will be confirmed at checkout.
              </div>
            </div>

            <Link
              href={items.length ? "/checkout" : "/shop"}
              className={`mt-6 w-full inline-flex items-center justify-center py-4 rounded-lg font-bold uppercase tracking-widest text-sm ${
                items.length ? "btn-primary hover:brightness-110" : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Proceed to Checkout
            </Link>

            <Link href="/shop" className="mt-3 w-full inline-flex items-center justify-center py-3 btn-outline text-xs hover:bg-white/10">
              Continue Shopping
            </Link>

            <p className="mt-4 text-xs text-white/55">
              Orders are confirmed on WhatsApp after checkout.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <BrandLogo size={54} />
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/shop">
            Shop
          </Link>
          <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/custom-order">
            Custom Designs
          </Link>
          <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/contact">
            Contact
          </Link>
        </nav>
      </div>

      <Link href="/shop" className="btn-outline px-5 py-2 text-xs hover:bg-white/10">
        Shop
      </Link>
    </header>
  );
}