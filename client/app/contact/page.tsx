import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import CustomerHeader from "@/components/CustomerHeader";

const WHATSAPP_NUMBER = "2347065630239";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const message = "Hi LA'KIDA, I want to ask about an order / custom tailoring.";

  return (
    <main className="page">
      <CustomerHeader />

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
              <InfoCard
                icon="chat"
                title="WhatsApp"
                desc="Fastest response for orders & custom requests."
                action={
                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm hover:brightness-110"
                  >
                    Chat on WhatsApp
                  </a>
                }
              />
              <InfoCard
                icon="mail"
                title="Email"
                desc="For formal inquiries and collaborations."
                action={<p className="muted font-medium">lakida@yourbrand.com</p>}
              />
              <InfoCard
                icon="location_on"
                title="Location"
                desc="Lagos, Nigeria (appointments available)."
                action={
                  <Link href="/custom-order" className="text-[color:var(--accent)] font-bold hover:underline">
                    Book a fitting →
                  </Link>
                }
              />
            </div>

            <div className="card p-8">
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
    <div className="card p-7">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--lilac2)]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className="text-xl font-bold font-serif">{title}</h3>
      </div>
      <p className="mt-3 text-sm muted2">{desc}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <BrandLogo size={54} />

        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/shop">
            Shop
          </Link>
          <Link className="text-sm font-medium hover:text-[color:var(--accent)]" href="/custom-order">
            Custom Designs
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
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-white/90 hover:bg-white/10"
          aria-label="Cart"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
        </Link>

        <Link href="/shop" className="btn-primary px-6 py-2 text-sm hover:brightness-110">
          Shop Now
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[rgba(18,0,24,0.65)] px-6 lg:px-20 py-16">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="space-y-6">
          <BrandLogo size={56} />
          <p className="text-sm muted2">Redefining luxury through the lens of African craftsmanship.</p>
          <p className="text-sm muted2">Lagos, Nigeria</p>
        </div>

        <div>
          <h4 className="text-[color:var(--accent)] font-bold uppercase tracking-widest text-sm mb-6">
            Explore
          </h4>
          <ul className="space-y-4 text-sm text-white/70">
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
          <ul className="space-y-4 text-sm text-white/70">
            <li><Link className="hover:text-[color:var(--accent)]" href="/policies">Shipping & Returns</Link></li>
            <li><Link className="hover:text-[color:var(--accent)]" href="/policies">Size Guide</Link></li>
            <li><Link className="hover:text-[color:var(--accent)]" href="/policies">FAQ</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[color:var(--accent)] font-bold uppercase tracking-widest text-sm">
            Newsletter
          </h4>
          <p className="text-sm muted2">Join the inner circle for exclusive previews.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 uppercase tracking-[0.2em]">
        <p>©️ {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link className="hover:text-[color:var(--accent)]" href="/policies">Privacy</Link>
          <Link className="hover:text-[color:var(--accent)]" href="/policies">Terms</Link>
        </div>
      </div>
    </footer>
  );
}