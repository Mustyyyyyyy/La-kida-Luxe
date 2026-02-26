"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  description?: string;
  images?: { url: string; publicId: string }[];
  inStock?: boolean;
  stockQty?: number;
};

type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

const CART_KEY = "lakida_cart";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
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
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({
      productId: p._id,
      title: p.title,
      price: p.price,
      image: img,
      qty: 1,
    });
  }

  saveCart(cart);
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<"new" | "price_asc" | "price_desc">("new");

  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function run() {
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
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = [...products];

    if (category !== "All") {
      list = list.filter((p) => (p.category || "General") === category);
    }

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
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <Header />

      <section className="pt-24 pb-10 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
            Ready-to-Wear
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-3 font-serif">
            Shop the Collection
          </h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300 max-w-2xl">
            Discover handcrafted pieces with premium finishing—designed for confidence and culture.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-8">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2d00d]">search</span>
            <input
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2d00d]">tune</span>
            <select
              className="w-full bg-transparent outline-none text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#f8f8f5] dark:bg-[#221f10]">
                  {c}
                </option>
              ))}
            </select>

            <select
              className="bg-transparent outline-none text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort"
            >
              <option value="new" className="bg-[#f8f8f5] dark:bg-[#221f10]">
                New
              </option>
              <option value="price_asc" className="bg-[#f8f8f5] dark:bg-[#221f10]">
                Price ↑
              </option>
              <option value="price_desc" className="bg-[#f8f8f5] dark:bg-[#221f10]">
                Price ↓
              </option>
            </select>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-[1400px] mx-auto">
          {err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-500">
              {err}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-8 text-sm text-slate-600 dark:text-slate-300">
              Loading products...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-10 text-center">
              <p className="text-slate-700 dark:text-slate-300">
                No products match your search.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setSort("new");
                }}
                className="mt-4 inline-flex items-center justify-center border border-[#f2d00d]/35 text-[#f2d00d] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  className="group rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 border border-[#f2d00d]/15 hover:shadow-xl transition"
                >
                  <Link href={`/product/${p._id}`} className="block">
                    <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <Image
                        src={pickImage(p)}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white text-[#221f10] py-2 rounded-lg font-bold uppercase text-xs tracking-widest text-center">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold font-serif leading-snug">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {p.category || "General"}
                        </p>
                      </div>
                      <p className="text-[#f2d00d] font-bold">
                        {formatNaira(p.price)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          addToCart(p);
                          showToast("Added to cart");
                        }}
                        className="bg-[#f2d00d] text-[#221f10] py-3 rounded-lg font-bold uppercase tracking-widest text-[11px] hover:brightness-110"
                      >
                        Add to Cart
                      </button>
                      <Link
                        href={`/product/${p._id}`}
                        className="border border-[#f2d00d]/35 text-[#f2d00d] py-3 rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-[#f2d00d]/10 text-center"
                      >
                        Details
                      </Link>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      {p.inStock === false ? "Out of stock" : "Available"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full border border-[#f2d00d]/25 bg-[#221f10] text-white px-5 py-2 text-sm shadow-xl">
            {toast}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-[#f2d00d]/20 bg-[#221f10]/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 text-[#f2d00d]">
          <span className="material-symbols-outlined text-3xl">diamond</span>
          <h2 className="text-xl font-bold tracking-widest font-serif uppercase">
            LA&apos;KIDA
          </h2>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium hover:text-[#f2d00d]" href="/shop">
            Shop
          </Link>
          <Link className="text-sm font-medium hover:text-[#f2d00d]" href="/custom-order">
            Custom Order
          </Link>
          <Link className="text-sm font-medium hover:text-[#f2d00d]" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-[#f2d00d]" href="/contact">
            Contact
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/cart"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#f2d00d]/30 text-[#f2d00d] hover:bg-[#f2d00d]/10"
          aria-label="Cart"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
        </Link>

        <Link
          href="/login"
          className="border border-[#f2d00d]/35 text-[#f2d00d] px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#f2d00d]/10"
        >
          Login
        </Link>
      </div>
    </header>
  );
}