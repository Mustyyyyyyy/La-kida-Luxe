import Link from "next/link";

export default function CustomOrderPage() {
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
            href="/contact"
            className="bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
          >
            Contact
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-20 py-16">
        <div className="max-w-[900px] mx-auto rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-8 md:p-10">
          <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
            Custom Tailoring
          </span>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold font-serif">
            Request a Bespoke Piece
          </h1>
          <p className="mt-5 text-lg text-slate-700 dark:text-slate-300">
            Fill out the form below to share your vision, and we&apos;ll get
            back to you within 24-48 hours to discuss the details and next
            steps.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="bg-[#f2d00d] text-[#221f10] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110 text-center"
            >
              Message Us
            </Link>
            <Link
              href="/shop"
              className="border border-[#f2d00d]/35 text-[#f2d00d] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#f2d00d]/10 text-center"
            >
              Browse Ready-to-Wear
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}