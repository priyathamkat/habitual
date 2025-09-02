// Use Next.js API routes as a same-origin proxy to avoid CORS
export const API_BASE = "/api/entries";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  // 204 no content
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export async function listEntries(params: { limit: number; offset: number; order?: "asc" | "desc" }): Promise<import("../types/entries").EntryListResponse> {
  const { limit, offset, order = "desc" } = params;
  const url = new URL(`${API_BASE}`, typeof window === "undefined" ? "http://localhost" : window.location.origin);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", order);
  const res = await fetch(url.toString(), { cache: "no-store" });
  return handle(res);
}

export async function createEntry(body: import("../types/entries").EntryCreate) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<import("../types/entries").EntryRead>(res);
}

export async function updateEntry(id: string, body: import("../types/entries").EntryUpdate) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<import("../types/entries").EntryRead>(res);
}

export async function deleteEntry(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return handle<void>(res);
}
