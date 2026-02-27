import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";

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
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const newArrivals = products.slice(0, 6);

  const categories = [
    { name: "Bridal wears", href: "/shop?category=Bridal%20wears", icon: "diamond" },
    { name: "Aso ebi", href: "/shop?category=Aso%20ebi", icon: "styler" },
    { name: "Corporate fits", href: "/shop?category=Corporate%20fits", icon: "checkroom" },
    { name: "Casual wears", href: "/shop?category=Casual%20wears", icon: "apparel" },
    { name: "Birthday dress", href: "/shop?category=Birthday%20dress", icon: "celebration" },
  ];

  return (
    <main className="page">
      <Header />

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
          <p className="text-xl md:text-2xl text-[color:var(--accent)] italic mb-10 font-serif">
            Designed to be Unusually Classy.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="btn-primary px-10 py-4 text-lg hover:brightness-110"
            >
              Shop Now
            </Link>
            <Link
              href="/custom-order"
              className="btn-outline px-10 py-4 text-lg hover:bg-white/10"
            >
              Request Custom Designs.
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

      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">
                Explore
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 font-serif">
                Shop by Category
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-medium text-[color:var(--accent)] hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="group card p-6 hover:bg-white/10 transition"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--accent)] mb-4">
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <h3 className="text-lg font-bold font-serif">{c.name}</h3>
                <p className="text-sm muted mt-1">View pieces →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20" id="collections">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">
                New Arrivals
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 font-serif">
                Signature Pieces
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-medium text-[color:var(--accent)] hover:underline">
              View all →
            </Link>
          </div>

          {newArrivals.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="muted">
                No products yet. Add products from the admin panel and they’ll show here.
              </p>
              <div className="mt-4">
                <Link href="/admin" className="btn-primary px-6 py-3 hover:brightness-110 inline-flex">
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
                  className="group card p-0 overflow-hidden hover:shadow-xl transition"
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
                    <p className="mt-1 text-[color:var(--accent)] font-semibold">
                      {formatNaira(p.price)}
                    </p>
                    <p className="mt-2 text-sm muted">{p.category || "General"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}


function Header() {
  return (
    <header className="fixed top-0 w-full z-50 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
      <BrandLogo size={54} />

      <div className="relative">
        <details className="group">
          <summary className="list-none cursor-pointer btn-outline px-3 py-2">
            <span className="material-symbols-outlined">menu</span>
          </summary>

          <div className="absolute right-0 mt-3 w-56 card p-2 border border-white/10">
            <Link href="/login" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold">
              Login
            </Link>
            <Link href="/register" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold">
              Register
            </Link>

            <div className="h-px bg-white/10 my-2" />

            <Link href="/shop" className="block px-4 py-3 rounded-lg hover:bg-white/10">
              Shop
            </Link>
            <Link href="/custom-order" className="block px-4 py-3 rounded-lg hover:bg-white/10">
              Custom Order
            </Link>
            <Link href="/contact" className="block px-4 py-3 rounded-lg hover:bg-white/10">
              Contact
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}


function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[rgba(18,0,24,0.55)] px-6 lg:px-20 py-12">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <BrandLogo size={54} />
        <p className="muted text-sm">
          © {new Date().getFullYear()} LA&apos;KIDA. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}