"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import AuthLink from "@/components/AuthLink";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  images?: { url: string; publicId: string }[];
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

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

const DP = "text-[#2b0046]";
const DP_MUTED = "text-[rgba(43,0,70,0.75)]";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoadingProducts(true);
        const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
        const data = await res.json().catch(() => ([]));
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setProducts([]);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const newArrivals = useMemo(() => products.slice(0, 6), [products]);

  const categories = [
    { name: "Bridal wears", href: "/shop?category=Bridal%20wears", icon: "diamond" },
    { name: "Aso ebi", href: "/shop?category=Aso%20ebi", icon: "styler" },
    { name: "Corporate fits", href: "/shop?category=Corporate%20fits", icon: "checkroom" },
    { name: "Casual wears", href: "/shop?category=Casual%20wears", icon: "apparel" },
    { name: "Birthday dress", href: "/shop?category=Birthday%20dress", icon: "celebration" },
  ];

  return (
    <main className="page">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-white/65 z-10 pointer-events-none" />
          <div className="absolute inset-0">
            {/* IMPORTANT: Don't leave src="" or Next/Image will error */}
            <Image
              src="https://images.unsplash.com/photo-1520975958225-2f8b39f0f3e5?auto=format&fit=crop&w=1600&q=80"
              alt="High fashion African couture runway"
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
            <AuthLink
              href="/shop"
              requireAuth
              className="btn-primary px-10 py-4 text-xl hover:brightness-110"
            >
              Shop Now
            </AuthLink>

            <AuthLink
              href="/custom-order"
              requireAuth
              className="btn-outline px-10 py-4 text-xl hover:bg-white/10"
            >
              Request Custom Designs.
            </AuthLink>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-base">
            <span className={`px-5 py-3 rounded-full bg-white/60 border border-black/10 font-semibold ${DP}`}>
              Perfect Fit
            </span>
            <span className={`px-5 py-3 rounded-full bg-white/60 border border-black/10 font-semibold ${DP}`}>
              Premium Fabrics
            </span>
            <span className={`px-5 py-3 rounded-full bg-white/60 border border-black/10 font-semibold ${DP}`}>
              Delivery Available
            </span>
          </div>
        </div>

        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce ${DP}`}>
          <span className="material-symbols-outlined text-5xl">expand_more</span>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className={`font-bold tracking-widest uppercase text-sm ${DP}`}>Explore</span>
              <h2 className={`text-4xl md:text-5xl font-bold mt-2 font-serif ${DP}`}>
                Shop by Category
              </h2>
            </div>

            <AuthLink href="/shop" requireAuth className={`text-base font-semibold hover:underline ${DP}`}>
              View all →
            </AuthLink>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((c) => (
              <AuthLink
                key={c.name}
                href={c.href}
                requireAuth
                className="group card p-6 hover:bg-white/10 transition"
              >
                <div className={`w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-4 ${DP}`}>
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <h3 className={`text-xl font-bold font-serif ${DP}`}>{c.name}</h3>
                <p className={`text-base mt-1 ${DP_MUTED}`}>View pieces →</p>
              </AuthLink>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 px-6 lg:px-20" id="collections">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className={`font-bold tracking-widest uppercase text-sm ${DP}`}>New Arrivals</span>
              <h2 className={`text-4xl md:text-6xl font-bold mt-2 font-serif ${DP}`}>
                Signature Pieces
              </h2>
            </div>

            <AuthLink href="/shop" requireAuth className={`text-base font-semibold hover:underline ${DP}`}>
              View all →
            </AuthLink>
          </div>

          {loadingProducts || newArrivals.length === 0 ? (
            <div className="card p-10 text-center">
              <p className={`text-lg font-semibold ${DP}`}>No products yet.</p>
              <p className={`mt-2 ${DP_MUTED}`}>
                Once the admin adds products, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newArrivals.map((p) => (
                <AuthLink
                  key={p._id}
                  href={`/product/${p._id}`}
                  requireAuth
                  className="group card p-0 overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative aspect-[3/4] bg-slate-200 overflow-hidden">
                    <Image
                      src={pickImage(p)}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <span className="w-full bg-white text-[#2b0046] py-3 rounded-lg font-bold uppercase text-sm tracking-widest text-center">
                        View Details
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className={`text-2xl font-bold font-serif ${DP}`}>{p.title}</h3>
                    <p className={`mt-1 font-semibold text-lg ${DP}`}>{formatNaira(p.price)}</p>
                    <p className={`mt-2 text-base ${DP_MUTED}`}>{p.category || "General"}</p>
                  </div>
                </AuthLink>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
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

function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function close() {
    setOpen(false);
  }

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    close();
    window.location.href = "/login";
  }

  const linksLoggedOut = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];

  const linksLoggedIn = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Shop", href: "/shop" },
    { label: "Orders", href: "/orders" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <div className="relative z-[9999]">
      <button
        className="btn-outline px-3 py-2"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        type="button"
      >
        <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
      </button>

      {open ? (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/20"
            onClick={close}
            aria-label="Close menu"
            type="button"
          />
          <div className="absolute right-0 mt-3 w-60 z-50 card p-2 border border-white/10">
            {(loggedIn ? linksLoggedIn : linksLoggedOut).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className={`block px-4 py-3 rounded-lg hover:bg-white/10 font-bold text-base ${DP}`}
              >
                {l.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-2" />

            {!loggedIn ? (
              <>
                <Link
                  href="/contact"
                  onClick={close}
                  className={`block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold ${DP}`}
                >
                  Contact
                </Link>
              </>
            ) : (
              <button
                onClick={doLogout}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 font-bold text-red-600"
                type="button"
              >
                Logout
              </button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[rgba(18,0,24,0.10)] px-6 lg:px-20 py-12">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <BrandLogo size={54} />
        <p className={`text-sm font-semibold ${DP_MUTED}`}>
          ©️ {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}