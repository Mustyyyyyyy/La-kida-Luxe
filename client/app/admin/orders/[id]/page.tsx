"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
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

  const [selectedImg, setSelectedImg] = useState<string>("/placeholder-1.jpg");

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const [toast, setToast] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  const images = useMemo(() => product?.images || [], [product]);

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

        const first = data?.images?.[0]?.url || "/placeholder-1.jpg";
        setSelectedImg(first);

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

  const outOfStock = useMemo(() => {
    if (!product) return false;
    const qtyNum = Number(product.stockQty ?? 0);
    return product.inStock === false || qtyNum <= 0;
  }, [product]);

  function showToast(text: string) {
    setToast(text);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(""), 1600);
  }

  function openViewerByUrl(url: string) {
    if (!images.length) return;

    const idx = images.findIndex((x) => x.url === url);
    const safeIdx = idx >= 0 ? idx : 0;

    setViewerIndex(safeIdx);
    setViewerOpen(true);
  }

  function closeViewer() {
    setViewerOpen(false);
  }

  function nextImg() {
    if (!images.length) return;
    setViewerIndex((i) => (i + 1) % images.length);
  }

  function prevImg() {
    if (!images.length) return;
    setViewerIndex((i) => (i - 1 + images.length) % images.length);
  }

  useEffect(() => {
    if (!viewerOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    }

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [viewerOpen, images.length]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;

    if (start == null || end == null) return;
    const dx = end - start;

    if (Math.abs(dx) < 50) return;

    if (dx < 0) nextImg();
    else prevImg();
  }

  const viewerUrl = images[viewerIndex]?.url || selectedImg || "/placeholder-1.jpg";

  function addToCartNow() {
    if (!product) return;
    if (outOfStock) return showToast("Out of stock");

    const cart = loadCart();
    const idx = cart.findIndex(
      (x) => x.productId === product._id && x.size === size && x.color === color
    );

    const item: CartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      image: selectedImg || "/placeholder-1.jpg",
      qty: Math.max(1, qty),
      size: size || "",
      color: color || "",
    };

    if (idx >= 0) cart[idx].qty += item.qty;
    else cart.push(item);

    saveCart(cart);
    showToast("Added to cart");
  }

  async function notifyMe() {
    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setNotifyLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stock-alerts/${product._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Could not subscribe");

      showToast(data?.message || "Saved! We’ll email you when it’s back.");
    } catch (e: any) {
      showToast(e?.message || "Notify failed");
    } finally {
      setNotifyLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="sticky top-0 z-40 topbar px-4 sm:px-6 lg:px-20 py-4 flex items-center justify-between gap-3">
        <BrandLogo size={54} />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/shop" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
            Shop
          </Link>
          <Link href="/cart" className="btn-primary px-4 py-2 text-xs hover:brightness-110">
            Cart
          </Link>
        </div>
      </header>

      <section className="px-4 sm:px-6 lg:px-20 py-10">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="card p-8 text-sm font-bold text-white/80">Loading product...</div>
          ) : err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm font-bold text-red-200">
              {err}
              <div className="mt-4">
                <button
                  onClick={() => router.push("/shop")}
                  className="btn-primary px-6 py-3 text-xs hover:brightness-110"
                  type="button"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          ) : product ? (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => openViewerByUrl(selectedImg)}
                  className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/20 block"
                  aria-label="Open image viewer"
                >
                  <img
                    src={selectedImg || "/placeholder-1.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </button>

                {images.length ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((img) => {
                      const active = selectedImg === img.url;
                      return (
                        <button
                          key={img.publicId}
                          type="button"
                          onClick={() => {
                            setSelectedImg(img.url);
                            openViewerByUrl(img.url);
                          }}
                          className={[
                            "w-20 h-20 rounded-xl overflow-hidden border bg-black/20 flex-shrink-0",
                            active ? "border-[color:var(--accent)]" : "border-white/10",
                          ].join(" ")}
                          aria-label="View image"
                          title="View image"
                        >
                          <img src={img.url} alt={product.title} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="card p-6 sm:p-7 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] font-extrabold">
                  {product.category || "General"}
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-white">
                  {product.title}
                </h1>

                <p className="mt-4 text-2xl font-extrabold text-white">{formatNaira(product.price)}</p>

                <div className="mt-4">
                  <span
                    className={[
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border border-white/15",
                      outOfStock ? "bg-red-500/15 text-red-200" : "bg-white/10 text-white",
                    ].join(" ")}
                  >
                    {outOfStock ? "Out of stock" : "Available"}
                  </span>

                  {typeof product.stockQty === "number" ? (
                    <span className="ml-3 text-xs text-white/80 font-bold">Stock: {product.stockQty}</span>
                  ) : null}
                </div>

                <p className="mt-6 text-white/85 font-bold leading-relaxed">
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
                  <label className="text-xs font-extrabold uppercase tracking-widest text-[color:var(--accent)]">
                    Quantity
                  </label>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-lg border border-white/15 hover:bg-white/10 font-extrabold text-white"
                      disabled={outOfStock}
                      type="button"
                    >
                      −
                    </button>
                    <div className="w-12 text-center font-extrabold text-white">{qty}</div>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-10 h-10 rounded-lg border border-white/15 hover:bg-white/10 font-extrabold text-white"
                      disabled={outOfStock}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                {outOfStock ? (
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={notifyMe}
                      disabled={notifyLoading}
                      className="btn-outline w-full py-4 text-sm hover:bg-white/10 disabled:opacity-60"
                      type="button"
                    >
                      {notifyLoading ? "Saving..." : "Notify me when back in stock"}
                    </button>

                    <Link
                      href="/custom-order"
                      className="btn-primary w-full py-4 text-sm hover:brightness-110 text-center mt-7"
                    >
                      Request Custom
                    </Link>

                    <p className="text-xs text-white/75 font-bold mt-7">
                      We’ll email you when this item is available again.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={addToCartNow}
                      className="btn-primary py-4 text-sm hover:brightness-110"
                      type="button"
                    >
                      Add to Cart
                    </button>

                    <Link href="/custom-order" className="btn-outline py-4 text-sm hover:bg-white/10 text-center">
                      Request Custom
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {viewerOpen ? (
        <div className="fixed inset-0 z-[999] bg-black/90">
          <button
            type="button"
            className="absolute inset-0"
            onClick={closeViewer}
            aria-label="Close viewer"
          />

          <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-6">
            <div className="relative w-full max-w-5xl">
              <div className="absolute -top-14 left-0 right-0 flex items-center justify-between text-white">
                <div className="text-sm font-bold">
                  {images.length ? `${viewerIndex + 1} / ${images.length}` : ""}
                </div>

                <button
                  type="button"
                  onClick={closeViewer}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 font-bold"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Close
                </button>
              </div>

              <div
                className="relative w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 bg-black"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <img
                  src={viewerUrl}
                  alt="Preview"
                  className="w-full h-full object-contain max-h-[85vh] select-none"
                  draggable={false}
                />

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImg();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 text-white flex items-center justify-center"
                      aria-label="Previous image"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImg();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 text-white flex items-center justify-center"
                      aria-label="Next image"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </>
                ) : null}
              </div>

              {images.length > 1 ? (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {images.map((img, idx) => {
                    const active = idx === viewerIndex;
                    return (
                      <button
                        key={img.publicId}
                        type="button"
                        onClick={() => setViewerIndex(idx)}
                        className={[
                          "w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0 bg-black/40",
                          active ? "border-white" : "border-white/20",
                        ].join(" ")}
                        aria-label="Select image"
                      >
                        <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

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
      <label className="text-xs font-extrabold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input font-bold">
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#120018]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}