import EntriesClient from "./EntriesClient";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default function Page() {
  return <EntriesClient />;
}

