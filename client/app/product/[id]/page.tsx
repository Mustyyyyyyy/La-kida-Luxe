"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
        const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" });
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

    if (idx >= 0) {
      cart[idx].qty += item.qty;
    } else {
      cart.push(item);
    }

    saveCart(cart);
    showToast("Added to cart");
  }

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-[#f2d00d]/15 bg-white/70 dark:bg-[#221f10]/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[#f2d00d]">
          <span className="material-symbols-outlined text-3xl">diamond</span>
          <span className="text-xl font-bold tracking-widest font-serif uppercase">
            LA&apos;KIDA
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
          >
            Cart
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-8 text-sm text-slate-600 dark:text-slate-300">
              Loading product...
            </div>
          ) : err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-500">
              {err}
              <div className="mt-4">
                <button
                  onClick={() => router.push("/shop")}
                  className="bg-[#f2d00d] text-[#221f10] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          ) : product ? (
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#f2d00d]/15 bg-slate-200 dark:bg-slate-800">
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
                        className="relative w-20 h-24 rounded-xl overflow-hidden border border-[#f2d00d]/15 bg-slate-200 dark:bg-slate-800 flex-shrink-0"
                      >
                        <Image src={img.url} alt={product.title} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-7 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[#f2d00d] font-bold">
                  {product.category || "General"}
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-bold font-serif">
                  {product.title}
                </h1>

                <p className="mt-4 text-2xl font-bold text-[#f2d00d]">
                  {formatNaira(product.price)}
                </p>

                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#f2d00d]/25 bg-[#f2d00d]/10 text-[#f2d00d]">
                    {product.inStock === false ? "Out of stock" : "Available"}
                  </span>
                  {typeof product.stockQty === "number" ? (
                    <span className="ml-3 text-xs text-slate-600 dark:text-slate-300">
                      Stock: {product.stockQty}
                    </span>
                  ) : null}
                </div>

                <p className="mt-6 text-slate-700 dark:text-slate-300 leading-relaxed">
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
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
                    Quantity
                  </label>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-lg border border-[#f2d00d]/25 hover:bg-[#f2d00d]/10 font-bold"
                    >
                      −
                    </button>
                    <div className="w-12 text-center font-bold">{qty}</div>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-10 h-10 rounded-lg border border-[#f2d00d]/25 hover:bg-[#f2d00d]/10 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={addToCartNow}
                    className="bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href="/custom-order"
                    className="border border-[#f2d00d]/35 text-[#f2d00d] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#f2d00d]/10 text-center"
                  >
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
          <div className="rounded-full border border-[#f2d00d]/25 bg-[#221f10] text-white px-5 py-2 text-sm shadow-xl">
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
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg px-4 py-3"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#f8f8f5] dark:bg-[#221f10]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}