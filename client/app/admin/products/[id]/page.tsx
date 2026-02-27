import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/lib/api";

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

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f8f5] dark:bg-[#221f10] text-slate-900 dark:text-slate-100 px-4 sm:px-6 lg:px-20 py-24">
        <div className="max-w-4xl mx-auto rounded-2xl border border-[#f2d00d]/20 bg-white/70 dark:bg-white/5 p-6 sm:p-10 text-center">
          <h1 className="text-2xl font-bold font-serif">Product not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            This item may have been removed.
          </p>
          <Link
            href="/shop"
            className="inline-flex mt-6 bg-[#f2d00d] text-[#221f10] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const mainImage = product.images?.[0]?.url || "/placeholder-1.jpg";

  return (
    <main className="min-h-screen bg-[#f8f8f5] dark:bg-[#221f10] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-[#f2d00d]/15 bg-white/70 dark:bg-[#221f10]/80 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-20 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-[#f2d00d] min-w-0">
            <span className="material-symbols-outlined text-3xl">diamond</span>
            <span className="text-lg sm:text-xl font-bold tracking-widest font-serif uppercase truncate">
              LA&apos;KIDA
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/shop"
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#f2d00d]/35 text-[#f2d00d] hover:bg-[#f2d00d]/10"
              aria-label="Shop"
              title="Shop"
            >
              <span className="material-symbols-outlined">storefront</span>
            </Link>

            <Link
              href="/cart"
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#f2d00d] text-[#221f10] hover:brightness-110"
              aria-label="Cart"
              title="Cart"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
            </Link>

            <Link
              href="/shop"
              className="hidden sm:inline-flex border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
            >
              Shop
            </Link>

            <Link
              href="/cart"
              className="hidden sm:inline-flex bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
            >
              Cart
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 sm:px-6 lg:px-20 py-8 sm:py-10">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-6 sm:gap-10">
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
              <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {product.images.map((img) => (
                  <div
                    key={img.publicId}
                    className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border border-[#f2d00d]/15 bg-slate-200 dark:bg-slate-800 flex-shrink-0"
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

          <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-5 sm:p-7 md:p-10">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#f2d00d] font-bold">
              {product.category || "General"}
            </p>

            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight">
              {product.title}
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-bold text-[#f2d00d]">
              {formatNaira(product.price)}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#f2d00d]/25 bg-[#f2d00d]/10 text-[#f2d00d]">
                {product.inStock === false ? "Out of stock" : "Available"}
              </span>
              {typeof product.stockQty === "number" ? (
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Stock: {product.stockQty}
                </span>
              ) : null}
            </div>

            <p className="mt-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.description || "Premium finishing and a timeless silhouette."}
            </p>

            <div className="mt-7 grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-[#f2d00d]/15 bg-white/60 dark:bg-white/5 p-4">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Sizes
                </div>
                <div className="mt-2 text-sm">
                  {product.sizes?.length ? product.sizes.join(", ") : "—"}
                </div>
              </div>

              <div className="rounded-xl border border-[#f2d00d]/15 bg-white/60 dark:bg-white/5 p-4">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Colors
                </div>
                <div className="mt-2 text-sm">
                  {product.colors?.length ? product.colors.join(", ") : "—"}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/cart"
                className="bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 text-center"
              >
                Add to Cart
              </Link>
              <Link
                href="/custom-order"
                className="border border-[#f2d00d]/35 text-[#f2d00d] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#f2d00d]/10 text-center"
              >
                Request Custom
              </Link>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Checkout will confirm on WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}