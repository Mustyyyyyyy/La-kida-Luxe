"use client";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = RAW_API_URL.replace(/\/$/, ""); 

export function getApiUrl() {
  return API_URL;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function safeParse(res: Response) {
  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json().catch(() => ({}));
  }

  const text = await res.text().catch(() => "");
  return text ? { message: text } : {};
}

export async function apiFetchAuth<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has("Authorization") && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data: any = await safeParse(res);

  if (!res.ok) {
    const message =
      data?.message || data?.errors?.[0]?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}