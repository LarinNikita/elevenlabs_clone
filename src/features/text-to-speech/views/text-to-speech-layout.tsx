import type { ReactNode } from "react";

import { PageHeader } from "@/components/page-header";

type TextToSpeechLayoutProps = {
  children: ReactNode;
};

export default function TextToSpeechLayout({
  children,
}: TextToSpeechLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader title="Text to speech" />
      {children}
    </div>
  );
}
