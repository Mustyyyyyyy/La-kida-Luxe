"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

type Product = {
  _id: string;
  title: string;
  category?: string;
  price: number;
  description?: string;
  images?: { url: string; publicId: string }[];
  inStock?: boolean;
  stockQty?: number;
};

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount || 0);
}

function isOutOfStock(p: Product) {
  if (p.inStock === false) return true;
  if (p.inStock === true) return false;
  if (typeof p.stockQty === "number") return p.stockQty <= 0;
  return false;
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load product.");

        if (!mounted) return;
        setProduct(data);
        setActiveUrl(data?.images?.[0]?.url || "/placeholder-1.jpg");
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) run();
    return () => {
      mounted = false;
    };
  }, [id]);

  const out = useMemo(() => (product ? isOutOfStock(product) : false), [product]);

  return (
    <main className="page">
      <header className="sticky top-0 z-40 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
        <BrandLogo size={54} />
        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
            Shop
          </Link>
          <Link href="/cart" className="btn-primary px-4 py-2 text-xs hover:brightness-110">
            Cart
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="card p-8 text-sm font-bold text-white/80">Loading product...</div>
          ) : err ? (
            <div className="card p-8 text-sm font-bold text-red-200">
              {err}
              <div className="mt-4">
                <button onClick={() => router.push("/shop")} className="btn-primary px-6 py-3 text-xs">
                  Back to Shop
                </button>
              </div>
            </div>
          ) : product ? (
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <img src={activeUrl} alt={product.title} className="w-full h-full object-cover" />
                </div>

                {product.images?.length ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {product.images.map((img) => {
                      const active = img.url === activeUrl;
                      return (
                        <button
                          key={img.publicId}
                          type="button"
                          onClick={() => setActiveUrl(img.url)}
                          className={[
                            "w-20 h-24 rounded-xl overflow-hidden border flex-shrink-0",
                            active ? "border-white/60" : "border-white/10",
                          ].join(" ")}
                        >
                          <img src={img.url} alt={product.title} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="card p-7 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-white font-extrabold">
                  {product.category || "General"}
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-white">
                  {product.title}
                </h1>

                <p className="mt-4 text-2xl font-extrabold text-white">
                  {formatNaira(product.price)}
                </p>

                <div className="mt-4">
                  <span
                    className={[
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border",
                      out ? "bg-red-500/20 border-red-500/30 text-red-100" : "bg-white/10 border-white/15 text-white",
                    ].join(" ")}
                  >
                    {out ? "Out of stock" : "Available"}
                  </span>
                </div>

                <p className="mt-6 text-white/85 font-bold leading-relaxed">
                  {product.description || "Premium finishing and a timeless silhouette."}
                </p>

                <div className="mt-8">
                  {out ? (
                    <Link href={`/product/${product._id}`} className="btn-outline w-full py-4 text-sm text-center">
                      Notify me when back in stock
                    </Link>
                  ) : (
                    <Link href="/cart" className="btn-primary w-full py-4 text-sm text-center hover:brightness-110">
                      Add to Cart
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}