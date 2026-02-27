import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <Header />

      <section className="pt-28 pb-16 px-6 lg:px-20">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
            Our Story
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-3 font-serif">
            Crafted with Heritage. Finished with Luxury.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            LA&apos;KIDA is a high-end African fashion house dedicated to timeless silhouettes,
            premium fabrics, and precision tailoring. We blend tradition with modern
            design to create pieces that feel powerful, elegant, and personal.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card
              title="Bespoke Tailoring"
              desc="Made-to-measure pieces crafted to your exact body and style."
              icon="content_cut"
            />
            <Card
              title="Premium Finishing"
              desc="Clean lines, strong structure, and detail that lasts."
              icon="brush"
            />
            <Card
              title="Ready-to-Wear"
              desc="Signature pieces available for quick delivery and pickup."
              icon="checkroom"
            />
          </div>

          <div className="mt-14 rounded-2xl border border-[#f2d00d]/20 bg-white/70 dark:bg-white/5 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold font-serif">
              Our Promise
            </h2>
            <ul className="mt-5 space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#f2d00d]">
                  check_circle
                </span>
                Quality fabrics and clean finishing.
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#f2d00d]">
                  check_circle
                </span>
                Fittings and custom adjustments when needed.
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#f2d00d]">
                  check_circle
                </span>
                Clear communication and delivery options.
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="bg-[#f2d00d] text-[#221f10] px-7 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110 text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/custom-order"
                className="border border-[#f2d00d]/40 text-[#f2d00d] px-7 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#f2d00d]/10 text-center"
              >
                Request Custom Designs.
              </Link>
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
    <header className="fixed top-0 w-full z-50 border-b border-[#f2d00d]/20 bg-[#221f10]/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-[#f2d00d]">
          <span className="material-symbols-outlined text-3xl">diamond</span>
          <h2 className="text-xl font-bold tracking-widest font-serif uppercase">
            LA&apos;KIDA
          </h2>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium hover:text-[#f2d00d]" href="/shop">
            Shop
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#f2d00d]"
            href="/custom-order"
          >
            Custom Designs.
          </Link>
          <Link className="text-sm font-medium hover:text-[#f2d00d]" href="/about">
            About
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#f2d00d]"
            href="/contact"
          >
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

        <Link
          href="/login"
          className="hidden md:inline-flex items-center gap-2 border border-[#f2d00d]/30 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 border border-[#f2d00d]/30 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
        >
          Register
        </Link>
      </div>
    </header>
  );
}

function Card({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f2d00d]/20 bg-white/70 dark:bg-white/5 p-6 hover:shadow-xl transition">
      <div className="w-12 h-12 rounded-full bg-[#f2d00d]/15 flex items-center justify-center text-[#f2d00d] mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="text-xl font-bold font-serif">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
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
            Redefining luxury through the lens of African craftsmanship.
          </p>
          <p className="text-slate-400 text-sm">Lagos, Nigeria</p>
        </div>

        <div>
          <h4 className="text-[#f2d00d] font-bold uppercase tracking-widest text-sm mb-6">
            Explore
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link className="hover:text-[#f2d00d]" href="/shop">
                Shop
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2d00d]" href="/custom-order">
                Custom Designs
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2d00d]" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2d00d]" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#f2d00d] font-bold uppercase tracking-widest text-sm mb-6">
            Concierge
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link className="hover:text-[#f2d00d]" href="/policies">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2d00d]" href="/policies">
                Size Guide
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2d00d]" href="/policies">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

       <div className="space-y-4">
  <h4 className="text-[#f2d00d] font-bold uppercase tracking-widest text-sm">
    Newsletter
  </h4>
  <p className="text-slate-400 text-sm">
    Join the inner circle for exclusive previews.
  </p>
  <NewsletterForm />
</div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 uppercase tracking-[0.2em]">
        <p>© {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link className="hover:text-[#f2d00d]" href="/policies">
            Privacy
          </Link>
          <Link className="hover:text-[#f2d00d]" href="/policies">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}