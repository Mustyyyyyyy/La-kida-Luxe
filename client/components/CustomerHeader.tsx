"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";

type User = {
  role?: "admin" | "customer";
  fullName?: string;
  email?: string;
};

export default function CustomerHeader() {
  const [user, setUser] = useState<User | null>(null);

  function readUser() {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? (JSON.parse(raw) as User) : null;
      setUser(u);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    readUser();

    // keep it updated if login/logout happens in another tab
    const onStorage = () => readUser();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isCustomerLoggedIn =
    !!token && !!user && user.role !== "admin"; // customers only

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-40 topbar px-6 lg:px-20 py-4 flex items-center justify-between">
      <BrandLogo size={54} />

      <nav className="flex items-center gap-3">
        {isCustomerLoggedIn ? (
          <>
            <Link href="/shop" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
              Shop
            </Link>

            <Link href="/orders" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
              Orders
            </Link>

            <Link href="/cart" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
              Cart
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/15 hover:bg-white/10"
              aria-label="Logout"
              title="Logout"
              type="button"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/shop" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
              Shop
            </Link>

            <Link href="/login" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
              Login
            </Link>

            <Link href="/register" className="btn-primary px-4 py-2 text-xs hover:brightness-110">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}