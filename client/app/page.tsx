import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api";

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
  }).format(amount);
}

function pickImage(p: Product) {
  return p.images?.[0]?.url || "/placeholder-1.jpg";
}

export default async function HomePage() {
  // New arrivals from backend
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const newArrivals = products.slice(0, 6);

  const categories = [
    { name: "Kaftans", href: "/shop?category=Kaftans", icon: "content_cut" },
    { name: "Gowns", href: "/shop?category=Gowns", icon: "styler" },
    { name: "Suits", href: "/shop?category=Suits", icon: "checkroom" },
    { name: "Traditional", href: "/shop?category=Traditional", icon: "diamond" },
  ];

  return (
    <main className="bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/45 z-10" />
          <div className="absolute inset-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaOO59_EHre-MkrNUXU0f4HahP1eW2UERAfZswRyTHdj0jh_WYDCuYjqAhWixHmMBmvp8ZZd5Mk49hCenMdQqp6e5vFV0mM5Og9w0mj3aQRmLjccxA5Tzs8t2AQLC_3WMI9mccIh-5NgoVJosgJdD-6dPq9IaUc0oI_CTzrrqYbTwynHO_l6kFC3ID0z7lGJJnbMjjFIMC9pmEfsExZh51hDfNuzLxO8epnoCNXZRYEIe9SdtmUJ3mLKuxpLG7WLu10T5DoYqTAsM"
              alt="High fashion African couture runway"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            LA&apos;KIDA
          </h1>
          <p className="text-xl md:text-2xl text-[#f2d00d] italic mb-10 font-serif">
            The Essence of High-End African Fashion
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#f2d00d] text-[#221f10] px-10 py-4 rounded-lg font-bold text-lg hover:scale-[1.02] transition-transform"
            >
              Shop Now
            </Link>
            <Link
              href="/custom-order"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Request Custom Tailoring
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
              Perfect Fit
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
              Premium Fabrics
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white">
              Delivery Available
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/90">
          <span className="material-symbols-outlined text-4xl">expand_more</span>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
                Explore
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 font-serif">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-[#f2d00d] hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="group rounded-2xl border border-[#f2d00d]/20 bg-white/60 dark:bg-white/5 p-6 hover:bg-white/80 dark:hover:bg-white/10 transition"
              >
                <div className="w-12 h-12 rounded-full bg-[#f2d00d]/15 flex items-center justify-center text-[#f2d00d] mb-4">
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <h3 className="text-xl font-bold font-serif">{c.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  View pieces →
                </p>
                <div className="mt-4 h-px bg-[#f2d00d]/15" />
                <p className="mt-4 text-xs uppercase tracking-widest text-[#f2d00d] font-bold">
                  Browse
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS (backend connected) */}
      <section className="py-16 px-6 lg:px-20" id="collections">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
                New Arrivals
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 font-serif">
                Signature Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-[#f2d00d] hover:underline"
            >
              View all →
            </Link>
          </div>

          {newArrivals.length === 0 ? (
            <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/50 dark:bg-white/5 p-10 text-center">
              <p className="text-slate-700 dark:text-slate-300">
                No products yet. Add products from the admin panel and they’ll show here.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center bg-[#f2d00d] text-[#221f10] px-6 py-3 rounded-lg font-bold"
                >
                  Go to Admin
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newArrivals.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p._id}`}
                  className="group rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 border border-[#f2d00d]/15 hover:shadow-xl transition"
                >
                  <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={pickImage(p)}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <span className="w-full bg-white text-[#221f10] py-3 rounded-lg font-bold uppercase text-sm tracking-widest text-center">
                        View Details
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold font-serif">{p.title}</h3>
                    <p className="mt-1 text-[#f2d00d] font-semibold">
                      {formatNaira(p.price)}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {p.category || "General"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ATELIER / CUSTOM */}
      <section
        className="py-20 px-6 lg:px-20 bg-[#f8f8f5] dark:bg-[#1a180d]"
        id="atelier"
      >
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
              Bespoke Service
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 font-serif">
              The LA&apos;KIDA Atelier
            </h2>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
              Experience the pinnacle of personalization. Our master tailors collaborate
              with you to create a unique piece that celebrates your heritage and silhouette.
              Every stitch tells your story.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <Feature icon="content_cut" label="Custom Fitting" />
              <Feature icon="texture" label="Rare Fabrics" />
              <Feature icon="brush" label="Hand Finishing" />
            </div>

            <div className="mt-10 flex gap-3">
              <Link
                href="/custom-order"
                className="bg-[#f2d00d] text-[#221f10] px-7 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110"
              >
                Start Custom Order
              </Link>
              <Link
                href="/contact"
                className="border border-[#f2d00d]/40 text-[#f2d00d] px-7 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#f2d00d]/10"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="bg-[#221f10] border border-[#f2d00d]/20 p-8 md:p-10 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center font-serif">
              Quick Consultation
            </h3>

            {/* UI-only form (we'll connect later) */}
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Olamide" />
                <Input label="Last Name" placeholder="Bakare" />
              </div>
              <Input label="Email Address" placeholder="olamide@luxury.com" type="email" />
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
                  Service Interest
                </label>
                <select className="w-full bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] text-white px-4 py-3">
                  <option className="bg-[#221f10]">Bridal Couture</option>
                  <option className="bg-[#221f10]">Red Carpet</option>
                  <option className="bg-[#221f10]">Bespoke Suit</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
                  Message / Vision
                </label>
                <textarea
                  className="w-full bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] text-white px-4 py-3"
                  placeholder="Tell us about your occasion..."
                  rows={4}
                />
              </div>

              <button
                type="button"
                className="w-full bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-lg hover:brightness-110 transition-all uppercase tracking-widest"
              >
                Book Consultation
              </button>

              <p className="text-xs text-center text-white/60">
                We’ll connect this to WhatsApp + backend next.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 px-6 lg:px-20 overflow-hidden">
        <div className="text-center mb-12">
          <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
            Visual Story
          </span>
          <h2 className="text-3xl md:text-6xl font-bold mt-4 font-serif">
            The Gallery of Looks
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <GalleryCard
            title="Details"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa2vp_7JLCu9DTSmHeqGwlsUB4n9dDhdX_NBg_2MhbrTHhqrur7FUMfMt3XyhdGnhpoI9wJZRt_hMDO-yDRy06lBeXfmg7zBbaV2T5OPIylFqD0TIHSfcJK2jbTQHff2eNAa9HvYs92JgU8RRcyxF5TUBIC1ekffQFJAe0ZHD2No3GbG_fR6OevO0pYwXI4DMVu6vvTQC3wzUslPdVtfg3r1HM9nTNUxIUvP4JihMDtLfWi2NTpn9LYiqfmGNsL5oc5yX2OzyfBno"
          />
          <GalleryCard
            title="Elegance"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWZ09OmdRnqjSwh12tcHI11D7Bb56o8d_0YoOyOb9O2Z2MeAQedWDIsqSoG_G4eJullBbYeswe_C-r6lKZ7-1YFzFqNJHKjK9rm9q3nkZqe730emKNGZ6kaDrj35KShL57VzApaaEMxDWinBvW2dNWgDnHOXXCZUV0OtgmSYxp1fM0I8rotrxspYfqqdbf_Hz0eUePJvH2dhQeuISsKVLWP1WrgqrldZAO3I8zDfbc_Ve7EsAQre9eFR-wtBRpiR0RE_4cybH0OSk"
          />
          <GalleryCard
            title="Heritage"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9cn5W1ync8jSvVXKHIiI09w7-Dp2fbmdMIdCTNNNEfGoN8pdqs0CEHKjwhZFCHdi5dCgYTbRlrJaTKgnbZ-RP7d9ejJEJeiVMdBIPPhdM9ZIqrjBZ1zA93G-hb2jsMaR9MC0qNWGFIROCdpMzaW4l5zzFqBfSXQosenXFzTC_0bhjjonNbHLZ8nREoiOcsl7p0kTM06zIqRBL1DqR5m4D9qc49TrJ7MeqW84s_2FvKww5M_tfY1OtQhQrT4bxYR_xPnf7e-On520"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ---------------- Components (kept inside same file for easy copy) ---------------- */

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
          <Link className="text-sm font-medium hover:text-[#f2d00d] transition-colors" href="/shop">
            Shop
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#f2d00d] transition-colors"
            href="/custom-order"
          >
            Custom Order
          </Link>
          <Link className="text-sm font-medium hover:text-[#f2d00d] transition-colors" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-[#f2d00d] transition-colors" href="/contact">
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
          href="/shop"
          className="bg-[#f2d00d] text-[#221f10] px-6 py-2 rounded-lg font-bold text-sm tracking-wide hover:brightness-110 transition-all uppercase"
        >
          Shop Now
        </Link>
      </div>
    </header>
  );
}

function Feature({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-[#f2d00d]/5 rounded-xl border border-[#f2d00d]/20">
      <div className="w-12 h-12 rounded-full bg-[#f2d00d]/20 flex items-center justify-center text-[#f2d00d] mb-3">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] text-white px-4 py-3"
      />
    </div>
  );
}

function GalleryCard({ title, src }: { title: string; src: string }) {
  return (
    <div className="relative group rounded-xl overflow-hidden break-inside-avoid">
      <Image
        src={src}
        alt={title}
        width={1200}
        height={1600}
        className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white font-serif italic text-2xl">{title}</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1a180d] text-slate-100 py-16 px-6 lg:px-20 border-t border-[#f2d00d]/10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#f2d00d]">
            <span className="material-symbols-outlined text-3xl">diamond</span>
            <h2 className="text-xl font-bold tracking-widest font-serif uppercase">
              LA&apos;KIDA
            </h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Redefining luxury through the lens of African craftsmanship. Each piece is
            a tribute to heritage and future vision.
          </p>
          <p className="text-slate-400 text-sm">Lagos, Nigeria</p>
        </div>

        <div>
          <h4 className="text-[#f2d00d] font-bold uppercase tracking-widest text-sm mb-6">
            Explore
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link className="hover:text-[#f2d00d]" href="/shop">Shop</Link></li>
            <li><Link className="hover:text-[#f2d00d]" href="/custom-order">Custom Order</Link></li>
            <li><Link className="hover:text-[#f2d00d]" href="/about">About</Link></li>
            <li><Link className="hover:text-[#f2d00d]" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#f2d00d] font-bold uppercase tracking-widest text-sm mb-6">
            Concierge
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link className="hover:text-[#f2d00d]" href="/policies">Shipping & Returns</Link></li>
            <li><Link className="hover:text-[#f2d00d]" href="/policies">Size Guide</Link></li>
            <li><Link className="hover:text-[#f2d00d]" href="/policies">FAQ</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[#f2d00d] font-bold uppercase tracking-widest text-sm">
            Newsletter
          </h4>
          <p className="text-slate-400 text-sm">
            Join the inner circle for exclusive previews.
          </p>
          <div className="flex flex-col gap-2">
            <input
              className="bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] text-sm px-4 py-3"
              placeholder="Your Email"
              type="email"
            />
            <button className="bg-[#f2d00d] text-[#221f10] py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 uppercase tracking-[0.2em]">
        <p>© {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link className="hover:text-[#f2d00d]" href="/policies">Privacy</Link>
          <Link className="hover:text-[#f2d00d]" href="/policies">Terms</Link>
        </div>
      </div>
    </footer>
  );
}