"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  description?: string;
  images?: { url: string; publicId: string }[];
  inStock?: boolean;
};

type CartItem = { productId: string; title: string; price: number; image: string; qty: number };
const CART_KEY = "lakida_cart";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount || 0);
}
function pickImage(p: Product) {
  return p.images?.[0]?.url || "/placeholder-1.jpg";
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
function addToCart(p: Product) {
  const cart = loadCart();
  const idx = cart.findIndex((x) => x.productId === p._id);
  const img = pickImage(p);

  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ productId: p._id, title: p.title, price: p.price, image: img, qty: 1 });

  saveCart(cart);
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<"new" | "price_asc" | "price_desc">("new");
  const [toast, setToast] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getProducts();
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...products];

    if (category !== "All") list = list.filter((p) => (p.category || "General") === category);

    if (q) {
      list = list.filter((p) => {
        const hay = `${p.title} ${p.category || ""} ${p.description || ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sort === "price_asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));

    return list;
  }, [products, query, category, sort]);

  function showToast(text: string) {
    setToast(text);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="page">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[rgba(20,0,31,0.78)] backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <BrandLogo />
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/shop">Shop</Link>
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/custom-order">Custom Order</Link>
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/about">About</Link>
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/contact">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(242,208,13,0.30)] text-[color:var(--accent)] hover:bg-[rgba(242,208,13,0.10)]"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </Link>
          <Link href="/login" className="btn-outline px-5 py-2 text-xs">Login</Link>
        </div>
      </header>

      <section className="pt-24 pb-10 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">Ready-to-Wear</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-3 font-serif">Shop the Collection</h1>
          <p className="mt-4 muted max-w-2xl">
            Discover handcrafted pieces with premium finishing—designed for confidence and culture.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="px-6 lg:px-20 pb-8">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card-soft px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[color:var(--accent)]">search</span>
            <input
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/50"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="card-soft px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[color:var(--accent)]">tune</span>

            <select
              className="w-full bg-transparent outline-none text-sm text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#14001f]">
                  {c}
                </option>
              ))}
            </select>

            <select
              className="bg-transparent outline-none text-sm text-white"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort"
            >
              <option value="new" className="bg-[#14001f]">New</option>
              <option value="price_asc" className="bg-[#14001f]">Price ↑</option>
              <option value="price_desc" className="bg-[#14001f]">Price ↓</option>
            </select>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-[1400px] mx-auto">
          {err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">{err}</div>
          ) : null}

          {loading ? (
            <div className="card p-8 text-sm muted">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="card text-center p-10">
              <p className="muted">No products match your search.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setSort("new");
                }}
                className="mt-4 btn-outline px-6 py-3 text-xs"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-[rgba(255,255,255,0.06)] hover:shadow-xl transition"
                >
                  <Link href={`/product/${p._id}`} className="block">
                    <div className="relative aspect-[3/4] bg-black/20 overflow-hidden">
                      <Image
                        src={pickImage(p)}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white text-black py-2 rounded-lg font-bold uppercase text-xs tracking-widest text-center">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold font-serif leading-snug">{p.title}</h3>
                        <p className="mt-1 text-sm muted">{p.category || "General"}</p>
                      </div>
                      <p className="text-[color:var(--accent)] font-bold">{formatNaira(p.price)}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          addToCart(p);
                          showToast("Added to cart");
                        }}
                        className="btn-primary py-3 text-[11px]"
                      >
                        Add to Cart
                      </button>

                      <Link href={`/product/${p._id}`} className="btn-outline py-3 text-[11px] text-center">
                        Details
                      </Link>
                    </div>

                    <div className="mt-3 text-xs muted">{p.inStock === false ? "Out of stock" : "Available"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full border border-[rgba(242,208,13,0.25)] bg-[rgba(20,0,31,0.92)] text-white px-5 py-2 text-sm shadow-xl">
            {toast}
          </div>
        </div>
      ) : null}
    </main>
  );
}