import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const WHATSAPP_NUMBER = "2347065630239";
function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const message = "Hi LA'KIDA, I want to ask about an order / custom tailoring.";

  return (
    <main className="page">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[rgba(20,0,31,0.78)] backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <BrandLogo />

          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/shop">
              Shop
            </Link>
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/custom-order">
              Custom Order
            </Link>
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/about">
              About
            </Link>
            <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/contact">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(242,208,13,0.30)] text-[color:var(--accent)] hover:bg-[rgba(242,208,13,0.10)]"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </Link>

          <Link href="/shop" className="btn-primary px-6 py-2 text-xs">
            Shop Now
          </Link>
        </div>
      </header>

      <section className="pt-28 pb-16 px-6 lg:px-20">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">
            Contact
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-3 font-serif">
            Let’s Talk Style.
          </h1>

          <p className="mt-6 text-lg muted">
            Reach us for ready-to-wear orders, fittings, custom tailoring, and collaborations.
          </p>

          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
            <div className="grid gap-6">
              <div className="card-soft p-7">
                <h3 className="text-xl font-bold font-serif">WhatsApp</h3>
                <p className="mt-2 text-sm muted">Fastest response for orders & custom requests.</p>
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-4 px-6 py-3 text-sm inline-flex"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <div className="card-soft p-7">
                <h3 className="text-xl font-bold font-serif">Email</h3>
                <p className="mt-2 text-sm muted">For formal inquiries and collaborations.</p>
                <p className="mt-4 text-white/90 font-medium">lakida@yourbrand.com</p>
              </div>

              <div className="card-soft p-7">
                <h3 className="text-xl font-bold font-serif">Location</h3>
                <p className="mt-2 text-sm muted">Lagos, Nigeria (appointments available).</p>
                <Link href="/custom-order" className="mt-4 inline-block text-[color:var(--accent)] font-bold hover:underline">
                  Book a fitting →
                </Link>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold font-serif">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[rgba(20,0,31,1)] text-white py-16 px-6 lg:px-20 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <BrandLogo />
            <p className="muted text-sm leading-relaxed">
              Redefining luxury through the lens of African craftsmanship.
            </p>
            <p className="muted text-sm">Lagos, Nigeria</p>
          </div>

          <div>
            <h4 className="text-[color:var(--accent)] font-bold uppercase tracking-widest text-sm mb-6">
              Explore
            </h4>
            <ul className="space-y-4 text-sm muted">
              <li><Link className="hover:text-[color:var(--accent)]" href="/shop">Shop</Link></li>
              <li><Link className="hover:text-[color:var(--accent)]" href="/custom-order">Custom Order</Link></li>
              <li><Link className="hover:text-[color:var(--accent)]" href="/about">About</Link></li>
              <li><Link className="hover:text-[color:var(--accent)]" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[color:var(--accent)] font-bold uppercase tracking-widest text-sm mb-6">
              Concierge
            </h4>
            <ul className="space-y-4 text-sm muted">
              <li><Link className="hover:text-[color:var(--accent)]" href="/policies">Shipping & Returns</Link></li>
              <li><Link className="hover:text-[color:var(--accent)]" href="/policies">Size Guide</Link></li>
              <li><Link className="hover:text-[color:var(--accent)]" href="/policies">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[color:var(--accent)] font-bold uppercase tracking-widest text-sm">
              Newsletter
            </h4>
            <p className="muted text-sm">Join the inner circle for exclusive previews.</p>
            <NewsletterForm />
          </div>
        </div>
      </footer>
    </main>
  );
}