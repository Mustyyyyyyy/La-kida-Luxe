import Link from "next/link";
import Image from "next/image";
import AuthLink from "@/components/AuthLink";
import BrandLogo from "@/components/BrandLogo";
import NewsletterForm from "@/components/NewsletterForm";
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

function pickImage(p?: Product) {
  return p?.images?.[0]?.url || "/placeholder-1.jpg";
}

function normalizeCategory(c?: string) {
  const v = (c || "").trim();
  return v || "Uncategorized";
}

function isOutOfStock(p: Product) {
  const qtyKnown = typeof p.stockQty === "number";
  const qty = qtyKnown ? p.stockQty : 999999;
  return p.inStock === false || qty;
}

export default async function HomePage() {
  let products: Product[] = [];
  try {
    const data = await getProducts();
    products = Array.isArray(data) ? data : [];
  } catch {
    products = [];
  }

  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    const cat = normalizeCategory(p.category);
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(p);
  }

  const knownCats = CATEGORY_ORDER.filter((c) => byCategory.has(c));
  const otherCats = Array.from(byCategory.keys())
    .filter((c) => !CATEGORY_ORDER.includes(c))
    .sort((a, b) => a.localeCompare(b));

  const orderedCats = [...knownCats, ...otherCats];

  const categoryCards = CATEGORY_ORDER.map((name) => {
    const items = byCategory.get(name) || [];
    return {
      name,
      count: items.length,
      href: `/shop?category=${encodeURIComponent(name)}`,
      image: pickImage(items[0]),
    };
  });

  const trending = products.slice(0, 12);

  return (
    <main className="page">
      <Header />

      <section className="pt-28 pb-16 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[color:var(--accent)] font-extrabold tracking-widest uppercase text-sm">
              LA&apos;KIDA
            </p>
            <h1 className="mt-3 text-5xl md:text-7xl font-extrabold font-serif text-[color:var(--accent)] leading-tight">
              Designed to be Unusually Classy.
            </h1>
            <p className="mt-4 text-[rgba(43,0,70,0.75)] font-bold text-lg max-w-xl">
              Shop by category, explore trending pieces, and request custom designs — all in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <AuthLink
                href="/shop"
                requireAuth
                className="btn-primary px-8 py-4 text-sm md:text-base hover:brightness-110 text-center"
              >
                Shop Now
              </AuthLink>

              <AuthLink
                href="/custom-order"
                requireAuth
                className="btn-primary px-8 py-4 text-sm md:text-base hover:bg-brightness-110 text-center"
              >
                Request Custom
              </AuthLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-5 py-3 rounded-full bg-[color:var(--accent)] text-white font-extrabold text-sm border border-white/10">
                Perfect Fit
              </span>
              <span className="px-5 py-3 rounded-full bg-[color:var(--accent)] text-white font-extrabold text-sm border border-white/10">
                Premium Fabrics
              </span>
              <span className="px-5 py-3 rounded-full bg-[color:var(--accent)] text-white font-extrabold text-sm border border-white/10">
                Delivery Available
              </span>
            </div>
          </div>

          <div className="card p-3 md:p-5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/20 border border-white/10">
              <Image
                src="/placeholder-1.jpg"
                alt="LA'KIDA showcase"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="card p-4">
                  <div className="text-white font-extrabold text-lg">
                    Luxury finishing • Clean silhouette • Bold presence
                  </div>
                  <div className="mt-1 text-white/80 font-bold text-sm">
                    Explore pieces curated by category.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <span className="text-[color:var(--accent)] font-extrabold tracking-widest uppercase text-sm">
                Explore
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-[color:var(--accent)]">
                Shop by Category
              </h2>
              <p className="mt-2 text-[rgba(43,0,70,0.75)] font-bold">
                Products appear inside the category the admin selected.
              </p>
            </div>

            <AuthLink
              href="/shop"
              requireAuth
              className="text-[color:var(--accent)] font-extrabold hover:underline"
            >
              View shop →
            </AuthLink>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {categoryCards.map((c) => (
              <AuthLink
                key={c.name}
                href={c.href}
                requireAuth
                className="card overflow-hidden hover:brightness-[1.03] transition"
              >
                <div className="relative aspect-[4/3] bg-black/20">
                  <Image src={c.image} alt={c.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white font-extrabold text-sm md:text-base">
                      {c.name}
                    </div>
                    <div className="text-white/80 font-bold text-xs">
                      {c.count} item{c.count === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </AuthLink>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <span className="text-[color:var(--accent)] font-extrabold tracking-widest uppercase text-sm">
                Trending
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-[color:var(--accent)]">
                Trending Now
              </h2>
            </div>

            <AuthLink
              href="/shop"
              requireAuth
              className="text-[color:var(--accent)] font-extrabold hover:underline"
            >
              Browse all →
            </AuthLink>
          </div>

          {trending.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-white font-extrabold">No products yet.</p>        
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {trending.map((p) => (
                <AuthLink
                  key={p._id}
                  href={`/product/${p._id}`}
                  requireAuth
                  className="min-w-[210px] sm:min-w-[240px] card overflow-hidden"
                >
                  <div className="relative aspect-[3/4] bg-black/20">
                    <Image src={pickImage(p)} alt={p.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    {isOutOfStock(p) ? (
                      <div className="absolute top-3 left-3 rounded-full bg-red-500/25 border border-red-500/30 px-3 py-1 text-[10px] font-extrabold text-red-100 uppercase tracking-widest">
                        Out of stock
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4">
                    <div className="text-white font-extrabold text-sm leading-snug">
                      {p.title}
                    </div>
                    <div className="mt-2 text-white font-extrabold">
                      {formatNaira(p.price)}
                    </div>
                    <div className="mt-1 text-white/80 font-bold text-xs">
                      {normalizeCategory(p.category)}
                    </div>
                  </div>
                </AuthLink>
              ))}
            </div>
          )}
        </div>
      </section>



      <section className="py-10 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-[color:var(--accent)] font-extrabold tracking-widest uppercase text-sm">
                Portfolio
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-[color:var(--accent)]">
                Browse by Category
              </h2>
            </div>
          </div>

          {orderedCats.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-white font-extrabold text-lg">No products yet.</p>

            </div>
          ) : (
            orderedCats.map((cat) => {
              const items = (byCategory.get(cat) || []).slice(0, 4);
              if (items.length === 0) return null;

              return (
                <div key={cat} className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold font-serif text-[color:var(--accent)]">
                      {cat}
                    </h3>
                    <AuthLink
                      href={`/shop?category=${encodeURIComponent(cat)}`}
                      requireAuth
                      className="text-[color:var(--accent)] font-extrabold hover:underline"
                    >
                      View all →
                    </AuthLink>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((p) => (
                      <AuthLink
                        key={p._id}
                        href={`/product/${p._id}`}
                        requireAuth
                        className="card overflow-hidden"
                      >
                        <div className="relative aspect-[3/4] bg-black/20">
                          <Image src={pickImage(p)} alt={p.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                        </div>
                        <div className="p-4">
                          <div className="text-white font-extrabold text-sm leading-snug">
                            {p.title}
                          </div>
                          <div className="mt-2 text-white font-extrabold">
                            {formatNaira(p.price)}
                          </div>
                        </div>
                      </AuthLink>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="py-12 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6">
            <span className="text-[color:var(--accent)] font-extrabold tracking-widest uppercase text-sm">
              Why us
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-[color:var(--accent)]">
              Why LA&apos;KIDA
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Feature title="Perfect Fit" text="Tailored finishing that sits clean." icon="check_circle" />
            <Feature title="Premium Fabrics" text="Quality materials, luxury feel." icon="auto_awesome" />
            <Feature title="Custom Designs" text="Bespoke requests for your moment." icon="diamond" />
            <Feature title="Delivery Available" text="Fast coordination and support." icon="local_shipping" />
          </div>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="card p-8 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold font-serif text-white">
                  Get notified about new drops
                </h3>
                <p className="mt-2 text-white/80 font-bold">
                  Email only. No spam — just updates when we add new pieces.
                </p>
              </div>
              <div>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
      <BrandLogo size={64} />

      <details className="relative">
        <summary className="list-none cursor-pointer btn-outline px-3 py-2">
          <span className="material-symbols-outlined">menu</span>
        </summary>

        <div className="absolute right-0 mt-3 w-64 card p-2 border border-white/10 z-50">
          <Link href="/login" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-extrabold text-white">
            Login
          </Link>
          <Link href="/register" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-extrabold text-white">
            Register
          </Link>

          <div className="h-px bg-white/10 my-2" />

          <AuthLink
            href="/shop"
            requireAuth
            className="block px-4 py-3 rounded-lg hover:bg-white/10 font-extrabold text-white"
          >
            Shop
          </AuthLink>
          <AuthLink
            href="/orders"
            requireAuth
            className="block px-4 py-3 rounded-lg hover:bg-white/10 font-extrabold text-white"
          >
            Orders
          </AuthLink>
          <AuthLink
            href="/cart"
            requireAuth
            className="block px-4 py-3 rounded-lg hover:bg-white/10 font-extrabold text-white"
          >
            Cart
          </AuthLink>

          <div className="h-px bg-white/10 my-2" />

          <AuthLink
            href="/custom-order"
            requireAuth
            className="block px-4 py-3 rounded-lg hover:bg-white/10 font-bold text-white/90"
          >
            Custom Designs
          </AuthLink>
          <AuthLink
            href="/contact"
            requireAuth
            className="block px-4 py-3 rounded-lg hover:bg-white/10 font-bold text-white/90"
          >
            Contact
          </AuthLink>
        </div>
      </details>
    </header>
  );
}

function StoryCard({
  title,
  desc,
  href,
  img,
}: {
  title: string;
  desc: string;
  href: string;
  img: string;
}) {
  return (
    <AuthLink href={href} requireAuth className="card overflow-hidden hover:brightness-[1.03] transition">
      <div className="relative aspect-[4/3] bg-black/20">
        <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white font-extrabold text-xl">{title}</div>
          <div className="mt-1 text-white/80 font-bold text-sm">{desc}</div>
          <div className="mt-3 inline-flex btn-primary px-4 py-2 text-xs">Explore</div>
        </div>
      </div>
    </AuthLink>
  );
}

function Feature({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <div className="card p-6">
      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="text-white font-extrabold text-lg">{title}</div>
      <div className="mt-2 text-white/80 font-bold text-sm">{text}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[rgba(18,0,24,0.55)] px-6 lg:px-20 py-12">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <BrandLogo size={64} />
          <p className="mt-4 text-white/80 font-bold max-w-md">
            High-end African fashion. Ready-to-wear & bespoke tailoring — designed to be unusually classy.
          </p>
        </div>

        <div>
          <div className="text-white font-extrabold tracking-widest uppercase text-xs">
            Shop Categories
          </div>
          <div className="mt-4 grid gap-2">
            {CATEGORY_ORDER.map((c) => (
              <AuthLink
                key={c}
                href={`/shop?category=${encodeURIComponent(c)}`}
                requireAuth
                className="text-white/85 font-bold hover:underline"
              >
                {c}
              </AuthLink>
            ))}
          </div>
        </div>

        <div>
          <div className="text-white font-extrabold tracking-widest uppercase text-xs">
            Quick Links
          </div>
          <div className="mt-4 grid gap-2">
            <AuthLink href="/shop" requireAuth className="text-white/85 font-bold hover:underline">
              Shop
            </AuthLink>
            <AuthLink href="/custom-order" requireAuth className="text-white/85 font-bold hover:underline">
              Custom Designs
            </AuthLink>
            <AuthLink href="/contact" requireAuth className="text-white/85 font-bold hover:underline">
              Contact
            </AuthLink>
            <Link href="/policies" className="text-white/85 font-bold hover:underline">
              Policies
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-10 text-white/70 font-bold text-sm">
        © {new Date().getFullYear()} LA&apos;KIDA. All rights reserved.
      </div>
    </footer>
  );
}