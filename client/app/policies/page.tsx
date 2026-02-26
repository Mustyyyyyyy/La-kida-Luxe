import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import NewsletterForm from "@/components/NewsletterForm";

export default function PoliciesPage() {
  return (
    <main className="page">
      <Header />

      <section className="pt-28 pb-16 px-6 lg:px-20">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">
            Policies
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-3 font-serif">
            Shipping, Returns & Terms
          </h1>

          <p className="mt-6 text-lg muted">
            These policies keep everything clear and smooth. If you need help, reach us via
            the contact page.
          </p>

          <div className="mt-10 grid gap-6">
            <PolicyCard
              title="Delivery"
              icon="local_shipping"
              items={[
                "Delivery is available within Lagos and nationwide via dispatch.",
                "Delivery fees depend on location and will be confirmed on WhatsApp.",
                "Pickup option is available for selected orders.",
              ]}
            />

            <PolicyCard
              title="Ready-to-Wear Returns"
              icon="swap_horiz"
              items={[
                "Returns/exchanges are accepted within 48 hours of delivery (ready-to-wear only).",
                "Item must be unused and in original condition.",
                "Customer covers return shipping unless we made an error.",
              ]}
            />

            <PolicyCard
              title="Custom Orders (Tailoring)"
              icon="content_cut"
              items={[
                "Custom orders are made-to-measure and cannot be returned.",
                "If there is a fitting issue, we offer adjustments based on agreement.",
                "Please provide accurate measurements for the best fit.",
              ]}
            />

            <PolicyCard
              title="Payments"
              icon="payments"
              items={[
                "Orders are confirmed after payment (or agreed deposit for custom work).",
                "Payment method is discussed on WhatsApp (bank transfer).",
                "Receipts/confirmation can be provided.",
              ]}
            />

            <PolicyCard
              title="Lead Time"
              icon="schedule"
              items={[
                "Ready-to-wear: usually 1–3 days depending on location.",
                "Custom tailoring: timeline depends on design complexity and fitting schedule.",
                "Urgent requests may attract an express fee.",
              ]}
            />
          </div>

          <div className="mt-12 card p-8">
            <h2 className="text-2xl font-bold font-serif">Need help?</h2>
            <p className="mt-2 muted">
              If you have any questions about delivery, sizes, fittings, or pricing—message us.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-primary px-7 py-3 text-sm text-center">
                Contact Us
              </Link>
              <Link href="/shop" className="btn-outline px-7 py-3 text-sm text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PolicyCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <div className="card-soft p-7">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[rgba(242,208,13,0.12)] flex items-center justify-center text-[color:var(--accent)]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className="text-xl font-bold font-serif">{title}</h3>
      </div>

      <ul className="mt-5 space-y-2 text-white/90">
        {items.map((t, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="material-symbols-outlined text-[color:var(--accent)] text-xl">
              check
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Header() {
  return (
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
  );
}

function Footer() {
  return (
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
          <p className="muted text-sm">
            Join the inner circle for exclusive previews.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs muted uppercase tracking-[0.2em]">
        <p>©️ {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link className="hover:text-[color:var(--accent)]" href="/policies">
            Privacy
          </Link>
          <Link className="hover:text-[color:var(--accent)]" href="/policies">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}