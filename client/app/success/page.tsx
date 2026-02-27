import { Suspense } from "react";
import SuccessClient from "./successClient";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}