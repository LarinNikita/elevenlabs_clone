"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { VoicesList } from "../components/voices-list";

import { useTRPC } from "@/trpc/client";

function VoicesContent() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.voices.getAll.queryOptions());

  return (
    <>
      <VoicesList title="Team Voices" voices={data.custom} />
      <VoicesList title="Built-in Voices" voices={data.system} />
    </>
  );
}

export function VoicesView() {
  return (
    <div className="flex-1 space-y-10 overflow-y-auto p-3 lg:p-6">
      <VoicesContent />
    </div>
  );
}
