"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import CustomerHeader from "@/components/CustomerHeader";

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

type CartItem = { productId: string; title: string; price: number; image: string; qty: number };

const CART_KEY = "lakida_cart";

const CATEGORY_ORDER = [
  "Bridal wears",
  "Aso ebi",
  "Corporate fits",
  "Casual wears",
  "Birthday dress",
];

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

function normalizeCategory(c?: string) {
  const v = (c || "").trim();
  return v || "Uncategorized";
}

function isOutOfStock(p: Product) {
  if (typeof p.stockQty === "number") return p.stockQty <= 0;
  return p.inStock === false;
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
  if (isOutOfStock(p)) return;

  const cart = loadCart();
  const idx = cart.findIndex((x) => x.productId === p._id);
  const img = pickImage(p);

  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ productId: p._id, title: p.title, price: p.price, image: img, qty: 1 });

  saveCart(cart);
}

export default function ShopClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialCategory = (sp.get("category") || "All").trim();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [toast, setToast] = useState("");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => setActiveCategory(initialCategory || "All"), [initialCategory]);

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

  function showToast(text: string) {
    setToast(text);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(""), 1800);
  }

  const filteredBySearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const hay = `${p.title} ${p.category || ""} ${p.description || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, query]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return filteredBySearch;
  }, [filteredBySearch, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();

    for (const p of filteredBySearch) {
      const cat = normalizeCategory(p.category);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }

    const known = CATEGORY_ORDER.filter((c) => map.has(c));
    const rest = Array.from(map.keys())
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort((a, b) => a.localeCompare(b));

    const orderedCats = [...known, ...rest];

    return orderedCats.map((cat) => ({ category: cat, items: map.get(cat) || [] }));
  }, [filteredBySearch]);

  const navCats = useMemo(() => ["All", ...grouped.map((g) => g.category)], [grouped]);

  function pickCategory(cat: string) {
    setActiveCategory(cat);

    if (cat === "All") router.push("/shop");
    else router.push(`/shop?category=${encodeURIComponent(cat)}`);

    if (cat !== "All") {
      window.setTimeout(() => sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } else {
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    }
  }

  const viewGroups = useMemo(() => {
    if (activeCategory === "All") return grouped;
    return grouped.filter((g) => g.category === activeCategory);
  }, [grouped, activeCategory]);

  function ProductCard({ p }: { p: Product }) {
    const out = isOutOfStock(p);

    return (
      <div className="card overflow-hidden">
        <Link href={`/product/${p._id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-black/20">
            <Image src={pickImage(p)} alt={p.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {out ? (
              <div className="absolute top-3 left-3 rounded-full bg-red-500/25 border border-red-500/30 px-3 py-1 text-[10px] font-extrabold text-red-100 uppercase tracking-widest">
                Out of stock
              </div>
            ) : null}
          </div>
        </Link>

        <div className="p-4">
          <h3 className="text-sm md:text-lg font-extrabold text-white leading-snug">{p.title}</h3>
          <p className="mt-2 text-white font-extrabold">{formatNaira(p.price)}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {out ? (
              <Link href={`/product/${p._id}`} className="btn-outline py-3 text-[11px] text-center">
                View
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addToCart(p);
                  showToast("Added to cart");
                }}
                className="btn-primary py-3 text-[11px]"
              >
                Add
              </button>
            )}

            <Link href={`/product/${p._id}`} className="btn-outline py-3 text-[11px] text-center">
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="page">
      <CustomerHeader />

      <section className="pt-24 pb-6 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mt-3 font-serif text-[color:var(--accent)]">
            Shop
          </h1>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navCats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickCategory(c)}
                className={[
                  "whitespace-nowrap px-4 py-2 rounded-full font-extrabold text-xs uppercase tracking-widest border",
                  c === activeCategory
                    ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                    : "bg-white/10 text-[color:var(--accent)] border-[rgba(76,29,149,0.35)] hover:bg-white/15",
                ].join(" ")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="card px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-white font-bold">search</span>
            <input
              className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/60"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {err ? <div className="card p-6 text-sm font-bold text-red-200">{err}</div> : null}

          {loading ? (
            <div className="card p-8 text-sm font-bold text-white/80">Loading products...</div>
          ) : query.trim() ? (
            searchResults.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-white font-extrabold">No results found.</p>
                <p className="mt-2 text-white/80 font-bold">Try another keyword.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold font-serif text-[color:var(--accent)]">
                  Search Results
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7">
                  {searchResults.map((p) => (
                    <ProductCard key={p._id} p={p} />
                  ))}
                </div>
              </div>
            )
          ) : (
            viewGroups.map(({ category, items }) => (
              <div
                key={category}
                ref={(el) => {
                  sectionRefs.current[category] = el;
                }}
                className="space-y-4 scroll-mt-28"
              >
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-[color:var(--accent)]">
                    {category}
                  </h2>
                  <span className="text-sm font-bold text-[rgba(43,0,70,0.75)]">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7">
                  {items.map((p) => (
                    <ProductCard key={p._id} p={p} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full border border-white/10 bg-[rgba(18,0,24,0.9)] text-white px-5 py-2 text-sm font-bold shadow-xl">
            {toast}
          </div>
        </div>
      ) : null}
    </main>
  );
}