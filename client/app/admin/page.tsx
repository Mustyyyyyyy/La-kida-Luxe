"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import BrandLogo from "@/components/BrandLogo";

type UserLite = { fullName?: string; email?: string } | null;

export default function AdminHomePage( ) {
  return (
    <div className="page space-y-6">
      <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
      <p className="text-lg text-white/80">
        Welcome to admin.
      </p>
      </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserLite>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function doLogout() {
    logout();
    router.push("/login");
  }

  const nav = [
    { label: "Dashboard", href: "/admin", icon: "grid_view" },
    { label: "Products", href: "/admin/products", icon: "checkroom" },
    { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
    { label: "Messages", href: "/admin/messages", icon: "chat" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="page">
      <header className="sticky top-0 z-50 topbar">
        <div className="px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={52} />
            <div className="hidden sm:block">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Admin Console
              </div>
              <div className="text-xs text-white/70">
                {user?.fullName || "Admin"} {user?.email ? `• ${user.email}` : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:inline-flex btn-outline px-4 py-2 text-xs hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-base">home</span>
              <span className="ml-2">View site</span>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="btn-outline px-3 py-2"
              aria-label="Open admin menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-[rgba(18,0,24,0.96)] border-l border-white/10 backdrop-blur-md">
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrandLogo size={48} showText={false} />
                <div>
                  <div className="text-sm font-bold font-serif text-white/95">
                    Admin Menu
                  </div>
                  <div className="text-xs text-white/60">
                    {user?.fullName || "Admin"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="btn-outline px-3 py-2"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 space-y-2">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition border",
                      active
                        ? "bg-white/10 text-[color:var(--accent)] border-white/10"
                        : "text-white/85 border-white/10 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}

              <div className="h-px bg-white/10 my-3" />

              <button
                onClick={doLogout}
                className="btn-primary w-full py-3 text-sm hover:brightness-110 inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">{children}</main>
    </div>
  );
}