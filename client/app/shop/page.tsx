import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="page p-6 font-bold">Loading shop...</div>}>
      <ShopClient />
    </Suspense>
  );
}