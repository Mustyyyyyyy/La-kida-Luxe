import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function CustomOrderPage() {
  return (
    <main className="page">
      <header className="sticky top-0 z-40 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
        <BrandLogo size={54} />

        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
            Shop
          </Link>
          <Link href="/contact" className="btn-primary px-4 py-2 text-xs hover:brightness-110">
            Contact
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-20 py-16">
        <div className="max-w-[900px] mx-auto card p-8 md:p-10">
          <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">
            Custom Tailoring
          </span>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold font-serif">
            Request a Bespoke Piece
          </h1>
          <p className="mt-5 text-lg muted">
            Fill out the form below to share your vision, and we&apos;ll get
            back to you within 24-48 hours to discuss the details and next
            steps.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="btn-primary px-6 py-3 text-sm hover:brightness-110 text-center">
              Message Us
            </Link>
            <Link href="/shop" className="btn-outline px-6 py-3 text-sm hover:bg-white/10 text-center">
              Browse Ready-to-Wear
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}