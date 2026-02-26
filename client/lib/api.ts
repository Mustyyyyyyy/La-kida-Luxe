export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getProducts(params?: { q?: string; category?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.category) qs.set("category", params.category);

  const url = `${API_URL}/api/products${qs.toString() ? `?${qs}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}