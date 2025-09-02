const defaultBase =
  process.env.NODE_ENV === "production"
    ? "http://backend-prod:9009/api/v1"
    : "http://backend-dev:9009/api/v1";
const BACKEND_BASE = process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE || defaultBase;

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  const upstream = `${BACKEND_BASE}/entries/${search}`;
  const res = await fetch(upstream, { cache: "no-store" });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function POST(req: Request) {
  const upstream = `${BACKEND_BASE}/entries/`;
  const body = await req.text();
  const res = await fetch(upstream, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    cache: "no-store",
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}
