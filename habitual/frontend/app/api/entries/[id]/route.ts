const defaultBase =
  process.env.NODE_ENV === "production"
    ? "http://backend-prod:9009/api/v1"
    : "http://backend-dev:9009/api/v1";
const BACKEND_BASE = process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE || defaultBase;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upstream = `${BACKEND_BASE}/entries/${id}`;
  const res = await fetch(upstream, { cache: "no-store" });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upstream = `${BACKEND_BASE}/entries/${id}`;
  const body = await req.text();
  const res = await fetch(upstream, { method: "PATCH", headers: { "content-type": "application/json" }, body, cache: "no-store" });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upstream = `${BACKEND_BASE}/entries/${id}`;
  const res = await fetch(upstream, { method: "DELETE", cache: "no-store" });
  if (res.status === 204) {
    // 204 must not include a body
    return new Response(null, { status: 204 });
  }
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "text/plain" },
  });
}
