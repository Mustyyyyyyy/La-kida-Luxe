import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({
  href = "/",
  showText = true,
  size = 44,
  className = "",
}: {
  href?: string;
  showText?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="La'Kida Home"
    >
      <Image
        src="/lakida.png" 
        alt="La'Kida"
        width={size}
        height={size}
        priority
        className="rounded-md"
      />

      {showText ? (
        <span className="leading-tight">
          <span className="block text-lg font-bold tracking-widest font-serif uppercase text-[color:var(--accent)]">
            LA&apos;KIDA
          </span>
          <span className="block text-[11px] uppercase tracking-[0.2em] text-white/70">
            Luxury Couture
          </span>
        </span>
      ) : null}
    </Link>
  );
}