"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { TTSVoiceProvider } from "../context/tts-voices-context";

import { SettingsPanel } from "@/features/text-to-speech/components/settings-panel";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import { VoicePreviewPlaceholder } from "@/features/text-to-speech/components/voice-preview-placeholder";
import {
  TextToSpeechForm,
  type TTSFormValues,
} from "@/features/text-to-speech/components/text-to-speech-form";

import { useTRPC } from "@/trpc/client";

export function TextToSpeechDetailView({
  generationId,
}: {
  generationId: string;
}) {
  const trpc = useTRPC();
  const [generationQuery, voicesQuery] = useSuspenseQueries({
    queries: [
      trpc.generations.getById.queryOptions({ id: generationId }),
      trpc.voices.getAll.queryOptions(),
    ],
  });

  const data = generationQuery.data;
  const { custom: customVoices, system: systemVoices } = voicesQuery.data;

  const allVoices = [...customVoices, ...systemVoices];
  const fallbackVoiceId = allVoices[0]?.id ?? "";

  // Request voice may no longer exist (deleted); fall back to first available voice
  const resolvedVoiceId =
    data?.voiceId && allVoices.some((v) => v.id === data.voiceId)
      ? data.voiceId
      : fallbackVoiceId;

  const defaultValues: TTSFormValues = {
    text: data.text,
    voiceId: resolvedVoiceId,
    temperature: data.temperature,
    topP: data.topP,
    topK: data.topK,
    repetitionPenalty: data.repetitionPenalty,
  };

  const generationVoice = {
    id: data.voiceId ?? undefined,
    name: data.voiceName,
  };

  return (
    <TTSVoiceProvider value={{ customVoices, systemVoices, allVoices }}>
      <TextToSpeechForm key={generationId} defaultValues={defaultValues}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <TextInputPanel />
            <VoicePreviewPlaceholder />
          </div>
          <SettingsPanel />
        </div>
      </TextToSpeechForm>
    </TTSVoiceProvider>
  );
}
