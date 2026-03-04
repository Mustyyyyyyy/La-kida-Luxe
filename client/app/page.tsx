"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";
import AuthLink from "@/components/AuthLink";
import * as React from "react";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  images?: { url: string; publicId: string }[];
};

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

const CATEGORY_ORDER = [
  "Bridal wears",
  "Aso ebi",
  "Corporate fits",
  "Casual wears",
  "Birthday dress",
];

function normalizeCategory(c?: string) {
  const v = (c || "").trim();
  return v || "Uncategorized";
}

const DP = "text-[#2b0046]";
const DP_MUTED = "text-[rgba(43,0,70,0.75)]";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        setLoading(true);
        const data = await getProducts();
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of products) {
      const cat = normalizeCategory(p.category);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }

    const known = CATEGORY_ORDER.filter((c) => map.has(c));
    const rest = Array.from(map.keys())
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort((a, b) => a.localeCompare(b));

    const ordered = [...known, ...rest];

    return ordered.map((cat) => ({
      category: cat,
      items: (map.get(cat) || []).slice(0, 4),
      total: (map.get(cat) || []).length,
    }));
  }, [products]);

  return (
    <main className="page">
      <Header />

      <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-white/65 z-10" />
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1520975958225-2f8b39f0f3e5?auto=format&fit=crop&w=1600&q=80"
              alt="Fashion"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className={`text-6xl md:text-9xl font-bold mb-6 tracking-tight ${DP}`}>
            LA&apos;KIDA
          </h1>

          <p className={`text-2xl md:text-3xl italic mb-10 font-serif ${DP}`}>
            Designed to be Unusually Classy.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <AuthLink href="/shop" requireAuth className="btn-primary px-10 py-4 text-xl hover:brightness-110">
              Shop Now
            </AuthLink>

            <AuthLink href="/custom-order" requireAuth className="btn-outline px-10 py-4 text-xl hover:bg-white/10">
              Request Custom Designs.
            </AuthLink>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-base">
            {["Perfect Fit", "Premium Fabrics", "Delivery Available"].map((t) => (
              <span
                key={t}
                className="px-5 py-3 rounded-full bg-[#4C1D95] border border-black/20 font-bold text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className={`font-bold tracking-widest uppercase text-sm ${DP}`}>
                Portfolio
              </span>
              <h2 className={`text-4xl md:text-5xl font-bold mt-2 font-serif ${DP}`}>
                Shop by Category
              </h2>
              <p className={`mt-3 font-semibold ${DP_MUTED}`}>
                Admin picks a category → product shows inside that category.
              </p>
            </div>

            <AuthLink href="/shop" requireAuth className={`text-base font-semibold hover:underline ${DP}`}>
              View all →
            </AuthLink>
          </div>

          {loading ? (
            <div className="card p-10 text-center">
              <p className="text-white font-bold">Loading products...</p>
            </div>
          ) : grouped.length === 0 ? (
            <div className="card p-10 text-center">
              <p className={`text-lg font-bold ${DP}`}>No products yet.</p>
              <p className={`mt-2 font-semibold ${DP_MUTED}`}>
                Once the admin adds products, categories will fill automatically.
              </p>
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.category} className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <h3 className={`text-2xl md:text-3xl font-bold font-serif ${DP}`}>
                    {g.category}
                  </h3>

                  <AuthLink
                    href={`/shop?category=${encodeURIComponent(g.category)}`}
                    requireAuth
                    className={`text-sm font-bold hover:underline ${DP}`}
                  >
                    View all →
                  </AuthLink>
                </div>

                {g.total === 0 ? (
                  <div className="card p-6">
                    <p className="text-white font-bold">No products in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7">
                    {g.items.map((p) => (
                      <AuthLink
                        key={p._id}
                        href={`/product/${p._id}`}
                        requireAuth
                        className="card overflow-hidden"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-black/20">
                          <Image src={pickImage(p)} alt={p.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        <div className="p-4">
                          <h4 className="text-white font-extrabold text-sm md:text-lg">
                            {p.title}
                          </h4>
                          <p className="mt-2 text-white font-extrabold">
                            {formatNaira(p.price)}
                          </p>
                        </div>
                      </AuthLink>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HeaderMenu() {
  const [open, setOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function close() {
    setOpen(false);
  }

  const loggedOutLinks = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Shop", href: "/login" },
    { label: "Custom Order", href: "/login" },
    { label: "Contact", href: "/login" },
  ];

  const loggedInLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Shop", href: "/shop" },
    { label: "Orders", href: "/orders" },
    { label: "Cart", href: "/cart" },
    { label: "Contact", href: "/contact" },
  ];

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    close();
    window.location.href = "/login";
  }

  return (
    <div className="relative">
      <button type="button" className="btn-outline px-3 py-2" onClick={() => setOpen((v) => !v)}>
        <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
      </button>

      {open ? (
        <>
          <button className="fixed inset-0 z-40 bg-black/20" onClick={close} type="button" />
          <div className="absolute right-0 mt-3 w-64 z-50 card p-2">
            {(loggedIn ? loggedInLinks : loggedOutLinks).map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={close as any}
                className={`block px-4 py-3 rounded-lg hover:bg-white/10 font-bold text-base ${DP}`}
              >
                {l.label}
              </Link>
            ))}

            {loggedIn ? (
              <>
                <div className="h-px bg-white/10 my-2" />
                <button
                  type="button"
                  onClick={doLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 font-bold text-red-700"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
      <BrandLogo size={54} />
      <HeaderMenu />
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[rgba(18,0,24,0.10)] px-6 lg:px-20 py-12">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <BrandLogo size={54} />
        <p className="text-sm font-semibold text-[rgba(43,0,70,0.75)]">
          ©️ {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}