import type { ReactNode } from "react";

import TextToSpeechLayout from "@/features/text-to-speech/views/text-to-speech-layout";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <TextToSpeechLayout>{children}</TextToSpeechLayout>;
}
