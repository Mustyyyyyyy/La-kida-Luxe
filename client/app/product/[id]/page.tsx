"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CART_KEY = "lakida_cart";

type Product = {
  _id: string;
  title: string;
  category?: string;
  price: number;
  description?: string;
  images?: { url: string; publicId: string }[];
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  stockQty?: number;
};

type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
};

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

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API_URL}/api/products/${id}`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load product.");

        if (!mounted) return;
        setProduct(data);

        if (data?.sizes?.length) setSize(data.sizes[0]);
        if (data?.colors?.length) setColor(data.colors[0]);
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

  const mainImage = useMemo(
    () => product?.images?.[0]?.url || "/placeholder-1.jpg",
    [product]
  );

  function showToast(text: string) {
    setToast(text);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(""), 1600);
  }

  function addToCartNow() {
    if (!product) return;

    const cart = loadCart();
    const idx = cart.findIndex(
      (x) => x.productId === product._id && x.size === size && x.color === color
    );

    const item: CartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      image: mainImage,
      qty: Math.max(1, qty),
      size: size || "",
      color: color || "",
    };

    if (idx >= 0) cart[idx].qty += item.qty;
    else cart.push(item);

    saveCart(cart);
    showToast("Added to cart");
  }

  return (
    <main className="page">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(20,0,31,0.78)] backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
        <BrandLogo />

        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn-outline px-4 py-2 text-xs">
            Shop
          </Link>
          <Link href="/cart" className="btn-primary px-4 py-2 text-xs">
            Cart
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="card p-8 text-sm muted">Loading product...</div>
          ) : err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
              {err}
              <div className="mt-4">
                <button
                  onClick={() => router.push("/shop")}
                  className="btn-primary px-6 py-3 text-xs"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          ) : product ? (
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {product.images?.length ? (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img) => (
                      <div
                        key={img.publicId}
                        className="relative w-20 h-24 rounded-xl overflow-hidden border border-white/10 bg-black/20 flex-shrink-0"
                      >
                        <Image
                          src={img.url}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Details */}
              <div className="card p-7 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] font-bold">
                  {product.category || "General"}
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-bold font-serif">
                  {product.title}
                </h1>

                <p className="mt-4 text-2xl font-bold text-[color:var(--accent)]">
                  {formatNaira(product.price)}
                </p>

                <div className="mt-4">
                  <span className="badge">
                    {product.inStock === false ? "Out of stock" : "Available"}
                  </span>
                  {typeof product.stockQty === "number" ? (
                    <span className="ml-3 text-xs muted">Stock: {product.stockQty}</span>
                  ) : null}
                </div>

                <p className="mt-6 muted leading-relaxed">
                  {product.description || "Premium finishing and a timeless silhouette."}
                </p>

                <div className="mt-7 grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Size"
                    value={size}
                    onChange={setSize}
                    options={
                      product.sizes?.length
                        ? product.sizes.map((s) => ({ value: s, label: s }))
                        : [{ value: "", label: "—" }]
                    }
                  />
                  <Select
                    label="Color"
                    value={color}
                    onChange={setColor}
                    options={
                      product.colors?.length
                        ? product.colors.map((c) => ({ value: c, label: c }))
                        : [{ value: "", label: "—" }]
                    }
                  />
                </div>

                <div className="mt-5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
                    Quantity
                  </label>

                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-lg border border-[rgba(242,208,13,0.25)] hover:bg-[rgba(242,208,13,0.10)] font-bold"
                    >
                      −
                    </button>
                    <div className="w-12 text-center font-bold">{qty}</div>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-10 h-10 rounded-lg border border-[rgba(242,208,13,0.25)] hover:bg-[rgba(242,208,13,0.10)] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 gap-3">
                  <button onClick={addToCartNow} className="btn-primary py-4 text-sm">
                    Add to Cart
                  </button>

                  <Link href="/custom-order" className="btn-outline py-4 text-sm text-center">
                    Request Custom
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(242,208,13,0.20)] rounded-lg px-4 py-3"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#14001f]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}