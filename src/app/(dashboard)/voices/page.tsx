import { SearchParams } from "nuqs/server";

import { VoicesView } from "@/features/voices/views/voices-view";
import { voicesSearchParamsCache } from "@/features/voices/lib/params";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query } = await voicesSearchParamsCache.parse(searchParams);

  prefetch(trpc.voices.getAll.queryOptions({ query }));

  return (
    <HydrateClient>
      <VoicesView />
    </HydrateClient>
  );
}
