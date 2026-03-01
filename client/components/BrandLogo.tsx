import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({
  href = "/",
  showText = true,
  size = 200, 
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
      aria-label="LA'KIDA Home"
    >
      <Image
        src="/lakida.png"
        alt="LA'KIDA"
        width={size}
        height={size}
        priority
        className="rounded-md"
      />

      {showText ? (
        <span className="leading-tight">
          <span className="block text-xl sm:text-2xl font-extrabold tracking-widest font-serif uppercase text-[#2b0046]">
            LA&apos;KIDA
          </span>

          <span className="block text-[12px] sm:text-[13px] uppercase tracking-[0.2em] text-[rgba(43,0,70,0.75)] font-bold">
            Designed to be unusually classy
          </span>
        </span>
      ) : null}
    </Link>
  );
}