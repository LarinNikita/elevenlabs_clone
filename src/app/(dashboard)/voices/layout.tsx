import type { Metadata } from "next";

import { VoicesLayout } from "@/features/voices/views/voices-layout";

export const metadata: Metadata = {
  title: "Voices Management",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <VoicesLayout>{children}</VoicesLayout>;
}
