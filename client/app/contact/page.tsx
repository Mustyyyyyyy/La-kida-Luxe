import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

const WHATSAPP_NUMBER = "2348109115088";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const message = "Hi LA'KIDA, I want to ask about an order / custom tailoring.";

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <Header />

      <section className="pt-28 pb-16 px-6 lg:px-20">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-[#f2d00d] font-bold tracking-widest uppercase text-sm">
            Contact
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-3 font-serif">
            Let’s Talk Style.
          </h1>

          <p className="mt-6 text-lg text-slate-700 dark:text-slate-300">
            Reach us for ready-to-wear orders, fittings, custom tailoring, and collaborations.
          </p>

          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
            <div className="grid gap-6">
              <InfoCard
                icon="chat"
                title="WhatsApp"
                desc="Fastest response for orders & custom requests."
                action={
                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center bg-[#f2d00d] text-[#221f10] px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110"
                  >
                    Chat on WhatsApp
                  </a>
                }
              />
              <InfoCard
                icon="mail"
                title="Email"
                desc="For formal inquiries and collaborations."
                action={
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    lakida@yourbrand.com
                  </p>
                }
              />
              <InfoCard
                icon="location_on"
                title="Location"
                desc="Lagos, Nigeria (appointments available)."
                action={
                  <Link
                    href="/custom-order"
                    className="text-[#f2d00d] font-bold hover:underline"
                  >
                    Book a fitting →
                  </Link>
                }
              />
            </div>

            <div className="bg-white/70 dark:bg-white/5 border border-[#f2d00d]/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold font-serif">Send a Message</h2>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoCard({
  icon,
  title,
  desc,
  action,
}: {
  icon: string;
  title: string;
  desc: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#f2d00d]/20 bg-white/70 dark:bg-white/5 p-7">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#f2d00d]/15 flex items-center justify-center text-[#f2d00d]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className="text-xl font-bold font-serif">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}

function Field({
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
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
      />
    </div>
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
            Custom Order
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
      </div>
    </header>
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
  <NewsletterForm />
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